package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleRepositoryPort {
    Optional<Role> findByRoleName(String roleName);
    Role save(Role role);
    List<Role> findAll();
    void deleteByName(String name);
}
