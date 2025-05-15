package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "conversation_participants")
@Table(name = "conversation_partitcipants")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaConversationParticipantEntity {
    @EmbeddedId
    JpaConversationParticipantEntityId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false, insertable = false, updatable = false)
    JpaConversationEntity conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    JpaUserEntity user;

    String name;

    @Column(name = "joined_at")
    LocalDateTime joinedAt;
}
