package com.doxan.doxan.adapter.out.kafka.adapter;

import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.domain.port.out.event.MessageSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaMessageAdapter implements MessageSender {
    private final KafkaTemplate<String, MessageResponse> kafkaMessageTemplate;

    @Value("${spring.bootstrap-servers.topics.message}")
    private String messageTopic;

    public KafkaMessageAdapter(final KafkaTemplate<String, MessageResponse> kafkaMessageTemplate) {
        this.kafkaMessageTemplate = kafkaMessageTemplate;
    }

    @Override
    public void sendMessage(MessageResponse message) {
        this.kafkaMessageTemplate.send(messageTopic, message.getId(), message);
    }
}
