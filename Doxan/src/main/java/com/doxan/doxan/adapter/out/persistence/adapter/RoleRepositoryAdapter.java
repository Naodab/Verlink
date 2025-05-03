package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.RoleMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaRoleRepository;
import com.doxan.doxan.domain.model.Role;
import com.doxan.doxan.domain.port.out.RoleRepositoryPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class RoleRepositoryAdapter implements RoleRepositoryPort {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JpaRoleRepository jpaRoleRepository;
    private final RoleMapper roleMapper;

    private static final String ROLE_PREFIX = "role:";

    @Value("${redis.ttl.role}")
    private long roleTTL;

    public RoleRepositoryAdapter(final RedisTemplate<String, Object> redisTemplate,
                                 final JpaRoleRepository jpaRoleRepository,
                                 final RoleMapper roleMapper) {
        this.redisTemplate = redisTemplate;
        this.jpaRoleRepository = jpaRoleRepository;
        this.roleMapper = roleMapper;
    }

    @Override
    public Optional<Role> findByRoleName(String roleName) {
        String key = ROLE_PREFIX + roleName;
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return Optional.of((Role) value);
        }
        return jpaRoleRepository.findByName(roleName)
                .map(roleMapper::toDomain)
                .map(role -> {
                    try {
                        redisTemplate.opsForValue().set(key, role, Duration.ofSeconds(roleTTL));
                    } catch (Exception e) {
                        log.error("Can't save role to redis", e);
                    }
                    return role;
                });
    }

    @Override
    public Role save(Role role) {
        Role newRole = roleMapper.toDomain(jpaRoleRepository
                .save(roleMapper.toEntity(role)));
        String key = ROLE_PREFIX + newRole.getName();
        try {
            redisTemplate.opsForValue().set(key, newRole, Duration.ofSeconds(roleTTL));
        } catch (Exception e) {
            log.error("Can't save role to redis", e);
        }
        return newRole;
    }

    @Override
    public List<Role> findAll() {
        return jpaRoleRepository.findAll().stream()
                .map(roleMapper::toDomain).toList();
    }

    @Override
    public void deleteByName(String name) {
        jpaRoleRepository.deleteByName(name);
        redisTemplate.delete(ROLE_PREFIX + name);
    }

    public boolean existsByName(String name) {
        return jpaRoleRepository.existsByName(name);
    }
}
