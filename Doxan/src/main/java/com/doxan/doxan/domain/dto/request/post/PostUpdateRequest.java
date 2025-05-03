package com.doxan.doxan.domain.dto.request.post;

import com.doxan.doxan.domain.model.enums.Visibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostUpdateRequest {
    String userId;
    String content;
    Visibility visibility;
    List<String> keepMediaIds;
}
