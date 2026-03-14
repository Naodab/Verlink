package com.doxan.doxan.adapter.out.kafka.consumer;

import com.doxan.doxan.adapter.out.websocket.WebSocketSessionManager;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponse;
import com.doxan.doxan.adapter.out.websocket.dto.WebSocketResponseType;
import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
@Component
public class MessageConsumer {
    private final ObjectMapper objectMapper;

    public MessageConsumer(final ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(
            topics = "${spring.bootstrap-servers.topics.message}",
            groupId = "message-group",
            containerFactory = "messageKafkaListenerContainerFactory"
    )
    public void listen(ConsumerRecord<String, MessageResponse> consumer) {
        MessageResponse message = consumer.value();
        log.info("{} đã gửi tin nhắn", message.getSender().getId());

        message.getRecipients().forEach(recipient -> {
            WebSocketSession session = WebSocketSessionManager.getSession(recipient.getId());

            if (session != null && session.isOpen()) {
                try {
                    String payload = objectMapper.writeValueAsString(WebSocketResponse.<MessageResponse>builder()
                            .type(WebSocketResponseType.NOTIFICATION.toString())
                            .message(message.getSender().getUsername() + " đã gửi tin nhắn cho bạn.")
                            .data(message)
                            .build());
                    session.sendMessage(new TextMessage(payload));
                } catch (Exception e) {
                    log.error("Error sending notification to user {}: {}", recipient.getId(), e.getMessage());
                }
            } else {
                log.info("User {} not connected via WebSocket", recipient.getId());
            }
        });
    }
}
