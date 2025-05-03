package com.doxan.doxan.domain.dto.request.post;

import com.doxan.doxan.domain.model.enums.Visibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreateRequest {
    String userId;
    String content;
    String targetId;
    Visibility visibility;
}
