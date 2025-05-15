package com.doxan.doxan.domain.dto.request.reaction;

import com.doxan.doxan.domain.model.enums.ReactionTargetType;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionCreateRequest {
    String targetId;
    ReactionType reactionType;
    ReactionTargetType targetType;
}
