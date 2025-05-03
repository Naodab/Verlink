package com.doxan.doxan.domain.dto.request.friendship;

import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipUpdateRequest {
    String userA;
    String userB;
    FriendshipStatus status;
}
