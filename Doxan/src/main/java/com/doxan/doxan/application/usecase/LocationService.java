package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Location;
import com.doxan.doxan.domain.port.in.LocationUseCase;
import com.doxan.doxan.domain.port.out.LocationRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService implements LocationUseCase {
    private final LocationRepositoryPort locationRepository;

    public LocationService(LocationRepositoryPort locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public Location create(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public List<Location> getAll() {
        return locationRepository.findAll();
    }

    @Override
    public void deleteById(String id) {
        locationRepository.deleteById(id);
    }

    @Override
    public Location getById(String id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LOCATION_NOT_EXISTS));
    }
}
