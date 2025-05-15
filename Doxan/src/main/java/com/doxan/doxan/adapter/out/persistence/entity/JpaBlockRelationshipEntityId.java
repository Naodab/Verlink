package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaBlockRelationshipEntityId implements Serializable {
    @Column(name = "blocker_id", nullable = false)
    String blockerId;

    @Column(name = "blocked_id", nullable = false)
    String blockedId;
}