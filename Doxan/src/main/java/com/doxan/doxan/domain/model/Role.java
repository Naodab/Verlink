package com.doxan.doxan.domain.model;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    private String name;
    private String description;
    private Set<Permission> permissions;
}
