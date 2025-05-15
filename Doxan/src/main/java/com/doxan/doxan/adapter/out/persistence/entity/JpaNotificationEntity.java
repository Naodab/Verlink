package com.doxan.doxan.adapter.out.persistence.entity;

import com.doxan.doxan.domain.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Entity(name = "notifications")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class JpaNotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    JpaUserEntity recipient;

    String senderId;
    String content;

    @Enumerated(EnumType.STRING)
    NotificationType type;

    String targetId;

    @Column(name = "is_read")
    boolean read;

    @Column(name = "create_at")
    LocalDateTime createdAt;

    String url;
}
