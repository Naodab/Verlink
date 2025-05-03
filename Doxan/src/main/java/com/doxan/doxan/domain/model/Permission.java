package com.doxan.doxan.domain.model;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Permission {
    private String name;
    private String description;
}
