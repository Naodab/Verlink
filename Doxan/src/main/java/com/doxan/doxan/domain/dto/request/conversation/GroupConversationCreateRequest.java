package com.doxan.doxan.domain.dto.request.conversation;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupConversationCreateRequest {
    String name;
    List<String> userIds;
}
