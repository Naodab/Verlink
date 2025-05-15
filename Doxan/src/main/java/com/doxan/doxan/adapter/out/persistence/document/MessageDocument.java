package com.doxan.doxan.adapter.out.persistence.document;

import com.doxan.doxan.domain.model.enums.MessageStatus;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collation = "messages")
public class MessageDocument {
    @Id
    String id;
    String senderId;
    String conversationId;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    MessageStatus status;
    Map<ReactionType, Long> reactionCounts = new EnumMap<>(ReactionType.class);
    List<String> mediaIds;
}