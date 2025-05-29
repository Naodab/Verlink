package com.doxan.doxan.adapter.out.kafka.adapter;

import com.doxan.doxan.domain.model.Notification;
import com.doxan.doxan.domain.port.out.event.NotificationSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaNotificationAdapter implements NotificationSender {
    private final KafkaTemplate<String, Notification> kafkaNotificationTemplate;

    @Value("${spring.bootstrap-servers.topics.notification}")
    private String notificationTopic;

    KafkaNotificationAdapter(KafkaTemplate<String, Notification> kafkaNotificationTemplate) {
        this.kafkaNotificationTemplate = kafkaNotificationTemplate;
    }

    @Override
    public void sendFriendRequestNotification(Notification notification) {
        kafkaNotificationTemplate.send(notificationTopic, notification.getRecipient().getId(), notification);
    }
}
