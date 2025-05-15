package com.doxan.doxan.adapter.out.kafka;

import com.doxan.doxan.domain.model.Notification;
import com.doxan.doxan.domain.port.out.NotificationSender;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaNotificationAdapter implements NotificationSender {
    private final KafkaTemplate<String, Notification> kafkaTemplate;

    KafkaNotificationAdapter(KafkaTemplate<String, Notification> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void sendFriendRequestNotification(Notification notification) {
        kafkaTemplate.send("notifications", notification.getRecipient().getId(), notification);
    }
}
