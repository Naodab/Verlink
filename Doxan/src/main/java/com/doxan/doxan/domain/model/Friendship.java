package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.FriendshipStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Friendship {
    private User requester;
    private User accepter;
    private LocalDateTime createdAt;
    private FriendshipStatus status;
}
