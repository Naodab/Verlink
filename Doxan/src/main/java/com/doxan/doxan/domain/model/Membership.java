package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.MemberRole;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Membership {
    private User user;
    private Group group;
    private MemberRole role;
    private LocalDateTime joinedAt;
}
