package com.doxan.doxan.adapter.out.kafka.consumer;

import com.doxan.doxan.adapter.out.kafka.adapter.KafkaTopic;
import com.doxan.doxan.adapter.out.websocket.WebSocketSessionManager;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponse;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponseType;
import com.doxan.doxan.domain.model.Notification;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
@Component
public class NotificationConsumer {
    private final ObjectMapper objectMapper;

    public NotificationConsumer(final ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
            topics = "notifications",
            groupId = "notification-group",
            containerFactory = "notificationKafkaListenerContainerFactory"
    )
    public void listen(ConsumerRecord<String, Notification> consumer) {
        Notification notification = consumer.value();
        log.info(notification.getContent());
        WebSocketSession session = WebSocketSessionManager.getSession(notification.getRecipient().getId());

        if (session != null && session.isOpen()) {
            try {
                String payload = objectMapper.writeValueAsString(WebSocketResponse.<Notification>builder()
                                .type(WebSocketResponseType.NOTIFICATION.toString())
                                .message(notification.getContent())
                                .data(notification)
                                .build());
                session.sendMessage(new TextMessage(payload));
            } catch (Exception e) {
                log.error("Error sending notification to user {}: {}", notification.getRecipient().getId(), e.getMessage());
            }
        } else {
            log.warn("User {} not connected via WebSocket", notification.getRecipient().getId());
        }
    }
}
