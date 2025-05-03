package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.ReactionType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private String id;
    private Post post;
    private User user;
    private String content;
    private Comment parent;
    private Set<Comment> children;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<ReactionType, Long> reactionCounts;
    private boolean edited;
}
