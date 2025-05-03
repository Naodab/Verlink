package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.FollowTargetType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "follows")
@Table(name = "follow_relationships")
public class JpaFollowEntity {
    @EmbeddedId
    JpaFollowEntityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", insertable = false, updatable = false)
    JpaUserEntity follower;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type")
    FollowTargetType targetType;

    @Column(name = "followed_at")
    LocalDateTime followedAt;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @EqualsAndHashCode
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class JpaFollowEntityId implements Serializable {
        @Column(name = "follower_id", nullable = false)
        String followerId;

        @Column(name = "target_id", nullable = false)
        String targetId;
    }
}
