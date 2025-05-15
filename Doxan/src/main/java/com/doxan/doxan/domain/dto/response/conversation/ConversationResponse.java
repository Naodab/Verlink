package com.doxan.doxan.domain.dto.response.conversation;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {
    String id;
    String name;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    long amount;
}
