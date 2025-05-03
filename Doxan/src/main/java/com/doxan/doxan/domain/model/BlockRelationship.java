package com.doxan.doxan.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockRelationship {
    private User blocker;
    private User blocked;
    private LocalDateTime blockedAt;
}
