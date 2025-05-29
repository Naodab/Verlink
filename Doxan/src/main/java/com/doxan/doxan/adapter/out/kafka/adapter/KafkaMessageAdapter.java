package com.doxan.doxan.adapter.out.kafka.adapter;

import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.domain.port.out.MessageSender;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaMessageAdapter implements MessageSender {
    private final KafkaTemplate<String, MessageResponse> kafkaTemplate;

    public KafkaMessageAdapter(final KafkaTemplate<String, MessageResponse> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public void sendMessage(MessageResponse message) {
        this.kafkaTemplate.send(KafkaTopic.MESSAGES.toString(), message.getId(), message);
    }
}
