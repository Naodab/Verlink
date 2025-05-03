package com.doxan.doxan.domain.predefined;

import com.doxan.doxan.domain.model.Role;

import java.util.Set;

public class RolePredefined {
    RolePredefined() {}

    public static final Role ADMIN = Role.builder()
            .name("ADMIN")
            .description("Administrator")
            .permissions(PermissionPredefined.getAdminPermissions())
            .build();

    public static final Role USER = Role.builder()
            .name("USER")
            .description("User")
            .permissions(PermissionPredefined.getUserPermissions())
            .build();

    public static Set<Role> getAllRolesPredefined() {
        return Set.of(ADMIN, USER);
    }
}
