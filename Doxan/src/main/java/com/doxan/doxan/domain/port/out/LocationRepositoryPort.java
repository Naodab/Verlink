package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Location;

import java.util.List;
import java.util.Optional;

public interface LocationRepositoryPort {
    Optional<Location> findById(String id);
    List<Location> findAll();
    Location save(Location location);
    void deleteById(String id);
    Optional<Location> findByUserId(String userId);
}
