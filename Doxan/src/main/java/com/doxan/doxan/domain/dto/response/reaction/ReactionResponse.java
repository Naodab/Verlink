package com.doxan.doxan.domain.dto.response.reaction;

import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionResponse {
    String targetId;
    UserResponse user;
    ReactionType reactionType;
    LocalDateTime createdAt;
}
