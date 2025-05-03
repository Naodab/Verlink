package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.MemberRole;
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
@Entity(name = "memberships")
@Table(name = "memberships")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaMembershipEntity {
    @EmbeddedId
    MembershipEntityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    JpaUserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", insertable = false, updatable = false)
    JpaGroupEntity group;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_role")
    MemberRole role;

    @Column(name = "joined_at")
    LocalDateTime joinedAt;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @EqualsAndHashCode
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class MembershipEntityId implements Serializable {
        @Column(name = "user_id", nullable = false)
        String userId;

        @Column(name = "group_id", nullable = false)
        String groupId;
    }
}
