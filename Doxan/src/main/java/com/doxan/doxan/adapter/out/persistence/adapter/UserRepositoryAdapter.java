package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.repository.JpaUserRepository;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.adapter.out.persistence.mapper.UserMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Slf4j
@Component
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JpaUserRepository jpaUserRepository;
    private final UserMapper userMapper;

    private final ReadWriteLock emailLock = new ReentrantReadWriteLock();
    private final ReadWriteLock phoneLock = new ReentrantReadWriteLock();


    private static final String USER_PREFIX_REDIS = "users:";
    private static final String EMAIL_SET = "users:email";
    private static final String PHONE_SET = "users:phone";

    private final RedisScript<Boolean> checkAndAddScript;
    private final RedisScript<Boolean> atomicUpdateScript;

    @Value("${redis.ttl.user}")
    private long userTTL;

    @Value("${app.cache.enabled:true}")
    private boolean cacheEnabled;

    @Value("${app.lock.timeout:1000}")
    private long lockTimeoutMillis;

    public UserRepositoryAdapter(final RedisTemplate<String, Object> redisTemplate,
                                 final JpaUserRepository jpaUserRepository,
                                 final UserMapper userMapper) {
        this.redisTemplate = redisTemplate;
        this.jpaUserRepository = jpaUserRepository;
        this.userMapper = userMapper;

        this.checkAndAddScript = RedisScript.of(
        "local exists = redis.call('SISMEMBER', KEYS[1], ARGV[1]); " +
                "if exists == 0 then redis.call('SADD', KEYS[1], ARGV[1]); end; " +
                "return exists == 1;",
                Boolean.class
        );

        this.atomicUpdateScript = RedisScript.of(
        "redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2]); " +
                "redis.call('SADD', KEYS[2], ARGV[3]); " +
                "redis.call('SADD', KEYS[3], ARGV[4]); " +
                "return true;",
                Boolean.class
        );
    }

    @Override
    @CacheEvict(value = {"userById", "userByEmail", "userByPhone"}, key = "#id")
    @CircuitBreaker(name = "userRepository", fallbackMethod = "deleteByIdFallback")
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteById(String id) {
        try {
            Optional<User> userOpt = findById(id);
            if (userOpt.isEmpty()) {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }
            User user = userOpt.get();

            try {
                final boolean emailLockAcquired = emailLock.writeLock().tryLock();
                try {
                    final boolean phoneLockAcquired = phoneLock.writeLock().tryLock();
                    try {
                        if (!emailLockAcquired || !phoneLockAcquired) {
                            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
                        }

                        jpaUserRepository.deleteById(id);

                        redisTemplate.execute(new SessionCallback<Object>() {
                            @Override
                            public <K, V> Object execute(@NonNull RedisOperations<K, V> operations)
                                    throws DataAccessException {
                                operations.multi();
                                redisTemplate.delete(USER_PREFIX_REDIS + id);
                                redisTemplate.opsForSet().remove(EMAIL_SET, user.getEmail());
                                redisTemplate.opsForSet().remove(PHONE_SET, user.getPhone());
                                return operations.exec();
                            }
                        });
                    } finally {
                        if (phoneLockAcquired) {
                            phoneLock.writeLock().unlock();
                        }
                    }
                } finally {
                    if (emailLockAcquired) {
                        emailLock.writeLock().unlock();
                    }
                }
            } catch (Exception e) {
                log.error("Failed to acquire locks for user deletion {}", id, e);
                throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
            }
        } catch (Exception e) {
            log.error("Error deleting user with id: {}", id, e);
            throw e;
        }
    }

    private void deleteByIdFallback(String id, Exception e) {
        log.error("Circuit opened when deleting user {}", id, e);
        throw new AppException(ErrorCode.DATABASE_ERROR);
    }

    @Override
    @Retry(name = "redisCalls")
    public boolean existsByEmail(String email) {
        if (!cacheEnabled) {
            return jpaUserRepository.existsByEmail(email);
        }

        emailLock.readLock().lock();
        try {
            Boolean exists = redisTemplate.opsForSet().isMember(EMAIL_SET, email);
            if (Boolean.TRUE.equals(exists)) {
                return true;
            }

            emailLock.readLock().unlock();
            emailLock.writeLock().lock();
            try {
                exists = redisTemplate.opsForSet().isMember(EMAIL_SET, email);
                if (Boolean.TRUE.equals(exists)) {
                    return true;
                }

                boolean dbExists = jpaUserRepository.existsByEmail(email);
                if (dbExists) {
                    try {
                        redisTemplate.opsForSet().add(EMAIL_SET, email);
                    } catch (Exception e) {
                        log.warn("Cannot update email cache for {}", email, e);
                    }
                }
                return dbExists;
            } finally {
                emailLock.readLock().lock();
                emailLock.writeLock().unlock();
            }
        } catch (Exception e) {
            log.warn("Redis error when checking email existence, falling back to DB", e);
            return jpaUserRepository.existsByEmail(email);
        } finally {
            emailLock.readLock().unlock();
        }
    }

    @Override
    @Retry(name = "redisCalls")
    public boolean existsByPhone(String phone) {
        if (!cacheEnabled) {
            return jpaUserRepository.existsByPhone(phone);
        }

        phoneLock.readLock().lock();
        try {
            Boolean exists = redisTemplate.execute(
                    checkAndAddScript,
                    Collections.singletonList(PHONE_SET),
                    phone
            );

            if (Boolean.TRUE.equals(exists)) {
                return true;
            }

            phoneLock.readLock().unlock();
            phoneLock.writeLock().lock();
            try {
                exists = redisTemplate.opsForSet().isMember(PHONE_SET, phone);
                if (Boolean.TRUE.equals(exists)) {
                    return true;
                }

                boolean dbExists = jpaUserRepository.existsByPhone(phone);
                if (dbExists) {
                    try {
                        redisTemplate.opsForSet().add(PHONE_SET, phone);
                    } catch (Exception e) {
                        log.warn("Cannot update phone cache for {}", phone, e);
                    }
                }
                return dbExists;
            } finally {
                // Hạ cấp lại thành read lock
                phoneLock.readLock().lock();
                phoneLock.writeLock().unlock();
            }
        } catch (Exception e) {
            log.warn("Redis error when checking phone existence, falling back to DB", e);
            return jpaUserRepository.existsByPhone(phone);
        } finally {
            phoneLock.readLock().unlock();
        }
    }

    @Override
    @Cacheable(value = "userById", key = "#id", unless = "#result == null || !cacheEnabled")
    @CircuitBreaker(name = "userRepository")
    public Optional<User> findById(String id) {
        String key = USER_PREFIX_REDIS + id;

        if (cacheEnabled) {
            try {
                Object value = redisTemplate.opsForValue().get(key);
                if (value != null) {
                    log.debug("User {} found in Redis cache", id);
                    return Optional.of((User) value);
                }
            } catch (Exception e) {
                log.warn("Redis error for findById({}), using DB", id, e);
            }
        }

        // Truy vấn từ database trong transaction đảm bảo isolation
        return findUserByIdFromDb(id);
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    protected Optional<User> findUserByIdFromDb(String id) {
        String key = USER_PREFIX_REDIS + id;
        return jpaUserRepository.findById(id)
            .map(userMapper::toDomain)
            .map(user -> {
                if (cacheEnabled) {
                    try {
                        List<String> keys = List.of(
                                key,
                                EMAIL_SET,
                                PHONE_SET
                        );

                        List<String> args = List.of(
                                serializeUser(user),
                                String.valueOf(userTTL),
                                user.getEmail(),
                                user.getPhone()
                        );

                        redisTemplate.execute(atomicUpdateScript, keys, args.toArray());
                    } catch (Exception e) {
                        log.warn("Failed to update Redis cache for user {}", id, e);
                    }
                }
                return user;
            });
    }

    private String serializeUser(User user) {
        return user.toString();
    }

    @Override
    @Cacheable(value = "userByEmail", key = "#email", unless = "#result == null || !cacheEnabled")
    @CircuitBreaker(name = "userRepository")
    @Transactional
    public Optional<User> findByEmail(String email) {
        if (cacheEnabled) {
            emailLock.readLock().lock();
            try {
                Boolean exists = redisTemplate.opsForSet().isMember(EMAIL_SET, email);
                if (Boolean.FALSE.equals(exists)) {
                    return Optional.empty();
                }
            } catch (Exception e) {
                log.warn("Redis error for findByEmail({}), using DB", email, e);
            } finally {
                emailLock.readLock().unlock();
            }
        }

        return findUserByEmailFromDb(email);
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    protected Optional<User> findUserByEmailFromDb(String email) {
        return jpaUserRepository.findByEmail(email)
            .map(userMapper::toDomain)
            .map(user -> {
                if (cacheEnabled) {
                    emailLock.writeLock().lock();
                    try {
                        saveToRedis(email, user, EMAIL_SET);
                    } catch (Exception e) {
                        log.warn("Failed to update Redis cache for email {}", email, e);
                    } finally {
                        emailLock.writeLock().unlock();
                    }
                }
                return user;
            });
    }

    @Override
    @Cacheable(value = "userByPhone", key = "#phone", unless = "#result == null || !cacheEnabled")
    @CircuitBreaker(name = "userRepository")
    public Optional<User> findByPhone(String phone) {
        if (cacheEnabled) {
            phoneLock.readLock().lock();
            try {
                Boolean exists = redisTemplate.opsForSet().isMember(PHONE_SET, phone);
                if (Boolean.FALSE.equals(exists)) {
                    return Optional.empty();
                }
            } catch (Exception e) {
                log.warn("Redis error for findByPhone({}), using DB", phone, e);
            } finally {
                phoneLock.readLock().unlock();
            }
        }

        return findUserByPhoneFromDb(phone);
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    protected Optional<User> findUserByPhoneFromDb(String phone) {
        return jpaUserRepository.findByPhone(phone)
            .map(userMapper::toDomain)
            .map(user -> {
                if (cacheEnabled) {
                    phoneLock.writeLock().lock();
                    try {
                        saveToRedis(phone, user, PHONE_SET);
                    } catch (Exception e) {
                        log.warn("Failed to update Redis cache for phone {}", phone, e);
                    } finally {
                        phoneLock.writeLock().unlock();
                    }
                }
                return user;
            });
    }

    private void saveToRedis(String phone, User user, String set) {
        String key = USER_PREFIX_REDIS + user.getId();

        redisTemplate.execute(new SessionCallback<>() {
            @Override
            public <K, V> Object execute(@NonNull RedisOperations<K, V> operations)
                    throws DataAccessException {
                operations.multi();
                redisTemplate.opsForValue().set(key, user, Duration.ofSeconds(userTTL));
                redisTemplate.opsForSet().add(set, phone);
                return operations.exec();
            }
        });
    }

    @Override
    @CacheEvict(value = {"userById", "userByEmail", "userByPhone"}, key = "#user.id != null ? #user.id : ''")
    @CircuitBreaker(name = "userRepository")
    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    @Retryable(
            value = {ObjectOptimisticLockingFailureException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 100)
    )
    public User save(User user) {
        final boolean emailLockAcquired = emailLock.writeLock().tryLock();
        final boolean phoneLockAcquired = phoneLock.writeLock().tryLock();

        try {
            if (!emailLockAcquired || !phoneLockAcquired) {
                throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
            }

            if (user.getId() != null) {
                Optional<User> existingUser = findById(user.getId());
                if (existingUser.isPresent()) {
                    User oldUser = existingUser.get();
                    if (!oldUser.getEmail().equals(user.getEmail())) {
                        redisTemplate.opsForSet().remove(EMAIL_SET, oldUser.getEmail());
                    }
                    if (oldUser.getPhone() != null && !oldUser.getPhone().equals(user.getPhone())) {
                        redisTemplate.opsForSet().remove(PHONE_SET, oldUser.getPhone());
                    }
                }
            }

            User savedUser = userMapper.toDomain(jpaUserRepository.save(userMapper.toEntity(user)));

            if (cacheEnabled) {
                try {
                    redisTemplate.execute(new SessionCallback<>() {
                        @Override
                        public <K, V> Object execute(@NonNull RedisOperations<K, V> operations)
                                throws DataAccessException {
                            operations.multi();
                            redisTemplate.opsForSet().add(EMAIL_SET, savedUser.getEmail());
                            redisTemplate.opsForSet().add(PHONE_SET, savedUser.getPhone());
                            redisTemplate.opsForValue().set(
                                    USER_PREFIX_REDIS + savedUser.getId(),
                                    savedUser,
                                    Duration.ofSeconds(userTTL)
                            );
                            return operations.exec();
                        }
                    });
                } catch (Exception e) {
                    log.warn("Failed to update Redis cache for saved user {}", savedUser.getId(), e);
                }
            }

            return savedUser;
        } finally {
            if (phoneLockAcquired) {
                phoneLock.writeLock().unlock();
            }
            if (emailLockAcquired) {
                emailLock.writeLock().unlock();
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        log.warn("findAll() called - this might be inefficient for millions of users");
        return findAllPaged(Pageable.ofSize(100)).getContent();
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public Page<User> findAllPaged(Pageable pageable) {
        return jpaUserRepository.findAll(pageable)
                .map(userMapper::toDomain);
    }

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public Page<User> findByFilter(String searchTerm, Pageable pageable) {
        return jpaUserRepository.findByEmailContainingOrPhoneContaining(searchTerm, searchTerm, pageable)
                .map(userMapper::toDomain);
    }
}
