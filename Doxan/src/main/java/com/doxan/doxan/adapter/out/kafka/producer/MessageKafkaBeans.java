package com.doxan.doxan.adapter.out.kafka.producer;

import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.infrastructure.config.KafkaConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class MessageKafkaBeans {
    private final KafkaConfig kafkaConfig;

    public MessageKafkaBeans(KafkaConfig kafkaConfig) {
        this.kafkaConfig = kafkaConfig;
    }

    @Bean
    public KafkaTemplate<String, MessageResponse> kafkaMessageTemplate() {
        return kafkaConfig.kafkaTemplate(MessageResponse.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MessageResponse> messageKafkaListenerContainerFactory() {
        return kafkaConfig.kafkaListenerContainerFactory(MessageResponse.class, "message-group");
    }
}
