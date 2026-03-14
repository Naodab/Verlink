package com.doxan.doxan.domain.port.out.event;

import com.doxan.doxan.domain.model.Notification;

public interface NotificationSender {
    void sendFriendRequestNotification(Notification notification);
}
