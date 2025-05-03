package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.model.Permission;

import java.util.List;

public interface PermissionUseCase {
    void deleteByName(String name);
    Permission getByName(String name);
    Permission create(Permission permission);
    List<Permission> getAll();
}
