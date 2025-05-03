package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.HiddenTargetType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hidden_contents")
@Entity(name = "hidden_contents")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaHiddenContentEntity {
    @EmbeddedId
    JpaHiddenContentEntityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    JpaUserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type")
    HiddenTargetType targetType;

    LocalDateTime hiddenAt;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class JpaHiddenContentEntityId implements Serializable {
        @Column(name = "user_id", nullable = false)
        String userId;

        @Column(name = "target_id", nullable = false)
        String targetId;
    }
}
