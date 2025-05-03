package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.HiddenTargetType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiddenContent {
    private User user;
    private String targetId;
    private HiddenTargetType targetType;
    private LocalDateTime hiddenAt;
}
