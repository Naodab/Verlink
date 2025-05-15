package com.doxan.doxan.adapter.out.websocket;

import com.doxan.doxan.domain.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KafkaListenerAdapter {
    private final SimpMessagingTemplate messagingTemplate;

    KafkaListenerAdapter(final SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(
            topics = "notifications",
            groupId = "notification-group",
            containerFactory = "notificationKafkaListenerContainerFactory"
    )
    public void listen(ConsumerRecord<String, Notification> consumer) {
        Notification notification = consumer.value();
        log.info(notification.getContent());
        messagingTemplate.convertAndSend("/topic/notifications/" + notification.getRecipient().getId(), notification);
    }
}
