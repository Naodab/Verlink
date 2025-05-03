package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.ReactionTargetType;
import com.doxan.doxan.domain.model.enums.ReactionType;
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
@Entity(name = "reactions")
@Table(name = "reactions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaReactionEntity {
    @EmbeddedId
    JpaReactionEntityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    JpaUserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type")
    ReactionTargetType targetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "felling_type")
    ReactionType fellingType;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class JpaReactionEntityId implements Serializable {
        @Column(name = "user_id", nullable = false)
        String userId;

        @Column(name = "target_id", nullable = false)
        String targetId;
    }
}
