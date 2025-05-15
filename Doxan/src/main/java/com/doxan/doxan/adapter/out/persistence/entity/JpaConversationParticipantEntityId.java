package com.doxan.doxan.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JpaConversationParticipantEntityId {
    @Column(name = "user_id", nullable = false)
    String userId;

    @Column(name = "conversation_id", nullable = false)
    String conversationId;
}
