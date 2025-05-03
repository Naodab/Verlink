package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.model.Role;

import java.util.List;

public interface RoleUseCase {
    void deleteByName(String name);
    Role getByName(String name);
    Role create(Role role);
    List<Role> getAll();
}
