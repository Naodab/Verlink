package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Check;

import java.io.Serializable;
import java.time.LocalDateTime;

@Table(
    name = "friendships",
    uniqueConstraints = {
            @UniqueConstraint(columnNames = {"requester_id", "accepter_id"})
    },
    indexes = {
            @Index(columnList = "requester_id"),
            @Index(columnList = "accepter_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Check(constraints = "requester_id <> accepter_id")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity(name = "friendships")
public class JpaFriendshipEntity {
    @EmbeddedId
    FriendshipId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", insertable = false, updatable = false)
    JpaUserEntity requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepter_id", insertable = false, updatable = false)
    JpaUserEntity accepter;

    @Enumerated(EnumType.STRING)
    @Column(name = "friendship_status")
    FriendshipStatus status;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Getter
    @Setter
    @Builder
    @Embeddable
    @EqualsAndHashCode
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class FriendshipId implements Serializable {
        @Column(name = "requester_id", nullable = false)
        String requesterId;

        @Column(name = "accepter_id", nullable = false)
        String accepterId;
    }
}
