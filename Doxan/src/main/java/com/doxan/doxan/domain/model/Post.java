package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.ReactionType;
import com.doxan.doxan.domain.model.enums.Visibility;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    private String id;
    private User user;
    private String targetId;
    private String content;
    private Visibility visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<ReactionType, Long> reactionCounts;
    private boolean edited;
    private int shareCount;
}
