package com.doxan.doxan.domain.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Page {
    private String id;
    private Set<User> admins;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
