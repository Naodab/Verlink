package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.ReactionTargetType;
import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Reaction {
    private User user;
    private String targetId;
    private ReactionTargetType targetType;
    private ReactionType fellingType;
    private LocalDateTime createdAt;
}
