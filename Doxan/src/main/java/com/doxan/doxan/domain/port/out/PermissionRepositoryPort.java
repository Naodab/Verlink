package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Permission;

import java.util.List;
import java.util.Optional;

public interface PermissionRepositoryPort {
    Optional<Permission> findByName(String name);
    Permission save(Permission permission);
    List<Permission> findAll();
    void deleteByName(String name);
}
