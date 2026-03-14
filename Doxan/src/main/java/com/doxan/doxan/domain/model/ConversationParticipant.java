package com.doxan.doxan.domain.model;


import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConversationParticipant {
    private User user;
    private Conversation conversation;
    private String name;
    private LocalDateTime joinedAt;
}
