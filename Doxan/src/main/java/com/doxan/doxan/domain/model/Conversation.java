package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.ConversationType;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ConversationType type;
}
