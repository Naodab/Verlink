package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.repository.JpaPermissionRepository;
import com.doxan.doxan.domain.model.Permission;
import com.doxan.doxan.domain.port.out.PermissionRepositoryPort;
import com.doxan.doxan.adapter.out.persistence.mapper.PermissionMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class PermissionRepositoryAdapter implements PermissionRepositoryPort {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JpaPermissionRepository jpaPermissionRepository;
    private final PermissionMapper permissionMapper;
    private static final String PERMISSION_PREFIX = "permission_";

    @Value("${redis.ttl.permission}")
    private int permissionTTL;

    public PermissionRepositoryAdapter(final RedisTemplate<String, Object> redisTemplate,
                                       final JpaPermissionRepository jpaPermissionRepository,
                                       final PermissionMapper permissionMapper) {
        this.redisTemplate = redisTemplate;
        this.jpaPermissionRepository = jpaPermissionRepository;
        this.permissionMapper = permissionMapper;
    }

    @Override
    public Optional<Permission> findByName(String name) {
        String key = PERMISSION_PREFIX + name;
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return Optional.of((Permission) value);
        }
        return jpaPermissionRepository.findByName(name)
                .map(permissionMapper::toDomain)
                .map(permission -> {
                    try {
                        redisTemplate.opsForValue().set(key, permission,
                                Duration.ofSeconds(permissionTTL));
                    } catch (Exception e) {
                        log.error("Can't save permission into redis", e);
                    }
                    return permission;
                });
    }

    @Override
    public Permission save(Permission permission) {
        String key = PERMISSION_PREFIX + permission.getName();
        Permission newPermission = permissionMapper.toDomain(jpaPermissionRepository
                .save(permissionMapper.toEntity(permission)));
        try {
            redisTemplate.opsForValue().set(key, newPermission,
                    Duration.ofSeconds(permissionTTL));
        } catch (Exception e) {
            log.error("Can't save permission into redis", e);
        }
        return newPermission;
    }

    @Override
    public List<Permission> findAll() {
        return jpaPermissionRepository.findAll()
                .stream().map(permissionMapper::toDomain).toList();
    }

    @Override
    public void deleteByName(String name) {
        jpaPermissionRepository.deleteByName(name);
        redisTemplate.delete(PERMISSION_PREFIX + name);
    }

    public boolean existsByName(String name) {
        return jpaPermissionRepository.existsByName(name);
    }
}
