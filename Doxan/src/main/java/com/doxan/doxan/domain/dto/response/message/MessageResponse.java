package com.doxan.doxan.domain.dto.response.message;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.dto.response.user.ParticipantConversationResponse;
import com.doxan.doxan.domain.model.enums.MessageStatus;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    String id;
    String conversationId;
    String content;
    LocalDateTime createdAt;
    MessageStatus status;
    ParticipantConversationResponse sender;
    List<ParticipantConversationResponse> recipients;
    Map<ReactionType, Long> reactionCounts;
    List<MediaResponse> images;
    List<MediaResponse> videos;
    List<MediaResponse> docs;
}
