package com.doxan.doxan.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Group {
    private String id;
    private String name;
    private String description;
    private boolean hide;
    private LocalDateTime createdAt;
}
