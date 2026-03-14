package com.doxan.doxan.domain.dto.request.conversation;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationCreateRequest {
    String otherId;
}
