package com.doxan.doxan.domain.predefined;

import com.doxan.doxan.domain.model.User;

import java.util.Set;

public class UserPredefined {
    private UserPredefined() {}

    public static final User ADMIN = User.builder()
            .email("admin@doxan.com")
            .password("123456")
            .roles(Set.of(RolePredefined.ADMIN))
            .username("admin")
            .build();
}
