package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.model.Location;

import java.util.List;

public interface LocationUseCase {
    Location create(Location location);
    List<Location> getAll();
    void deleteById(String id);
    Location getById(String id);
}
