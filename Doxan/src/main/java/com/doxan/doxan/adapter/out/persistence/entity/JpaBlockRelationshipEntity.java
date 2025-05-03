package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "block_relationships")
@Table(name = "block_relationships")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaBlockRelationshipEntity {
    @EmbeddedId
    BlockRelationshipId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocker_id", insertable = false, updatable = false)
    JpaUserEntity blocker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_id", insertable = false, updatable = false)
    JpaUserEntity blocked;

    @Column(name = "blocked_at", nullable = false)
    LocalDateTime blockedAt;
}
