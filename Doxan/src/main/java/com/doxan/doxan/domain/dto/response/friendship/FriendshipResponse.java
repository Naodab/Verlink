package com.doxan.doxan.domain.dto.response.friendship;

import com.doxan.doxan.domain.dto.response.user.UserResponse;
import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipResponse {
    UserResponse requester;
    UserResponse accepter;
    LocalDateTime createdAt;
    FriendshipStatus status;
}
