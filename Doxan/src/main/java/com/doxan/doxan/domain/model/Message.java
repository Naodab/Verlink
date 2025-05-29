package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.MessageStatus;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String id;
    private String senderId;
    private String conversationId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private MessageStatus status;
    private Map<ReactionType, Long> reactionCounts;
    private List<Media> medias;
}
