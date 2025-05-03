package com.doxan.doxan.domain.model;

import com.doxan.doxan.domain.model.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    private String id;
    private User recipient;
    private String senderId;
    private String content;
    private NotificationType type;
    private String targetId;
    private boolean read;
    private LocalDateTime createdAt;
}
