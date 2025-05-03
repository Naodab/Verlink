package com.doxan.doxan.domain.dto.request.friendship;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageCommonFriendshipRequest {
    String userAId;
    String userBId;
    int offset;
    int limit;
}
