package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.FollowTargetType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Follow {
    private User follower;
    private String targetId;
    private FollowTargetType targetType;
    private LocalDateTime followedAt;
}
