package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.repository.JpaLocationRepository;
import com.doxan.doxan.domain.model.Location;
import com.doxan.doxan.domain.port.out.LocationRepositoryPort;
import com.doxan.doxan.adapter.out.persistence.mapper.LocationMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;

@Slf4j
@Component
public class LocationRepositoryAdapter implements LocationRepositoryPort {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JpaLocationRepository jpaLocationRepository;
    private final LocationMapper locationMapper;
    private static final String LOCATION_PREFIX = "location:";

    @Value("${redis.ttl.location}")
    private int ttlLocation;

    public LocationRepositoryAdapter(final RedisTemplate<String, Object> redisTemplate,
                                     final JpaLocationRepository jpaLocationRepository,
                                     final LocationMapper locationMapper) {
        this.redisTemplate = redisTemplate;
        this.jpaLocationRepository = jpaLocationRepository;
        this.locationMapper = locationMapper;
    }

    @Override
    public Optional<Location> findById(String id) {
        String key = LOCATION_PREFIX + id;
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            return Optional.of((Location) value);
        }
        return jpaLocationRepository.findById(id)
            .map(locationMapper::toDomain)
            .map(location -> {
                try {
                    redisTemplate.opsForValue().set(key, location,
                            Duration.ofSeconds(ttlLocation));
                } catch (Exception e) {
                    log.error("Error when saving location to redis", e);
                }
                return location;
            });
    }

    @Override
    public List<Location> findAll() {
        return jpaLocationRepository.findAll().stream()
                .map(locationMapper::toDomain).toList();
    }

    @Override
    public Location save(Location location) {
        StringJoiner keyJoiner = new StringJoiner("");
        keyJoiner.add(LOCATION_PREFIX);
        Location newLocation = locationMapper.toDomain(jpaLocationRepository
                .save(locationMapper.toEntity(location)));
        keyJoiner.add(newLocation.getId());
        try {
            redisTemplate.opsForValue().set(keyJoiner.toString(),
                    newLocation, Duration.ofSeconds(ttlLocation));
        } catch (Exception e) {
            log.error("Error when saving location to redis", e);
        }
        return newLocation;
    }

    @Override
    public void deleteById(String id) {
        jpaLocationRepository.deleteById(id);
        redisTemplate.delete(LOCATION_PREFIX + id);
    }

    @Override
    public Optional<Location> findByUserId(String userId) {
        return Optional.empty();
    }
}
