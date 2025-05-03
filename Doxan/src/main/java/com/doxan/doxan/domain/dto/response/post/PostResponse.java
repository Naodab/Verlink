package com.doxan.doxan.domain.dto.response.post;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.model.enums.ReactionType;
import com.doxan.doxan.domain.model.enums.Visibility;
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
public class PostResponse {
    String id;
    UserResponse user;
    String content;
    Visibility visibility;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Map<ReactionType, Long> reactionCounts;
    boolean edited;
    int shareCount;
    List<MediaResponse> medias;
}
