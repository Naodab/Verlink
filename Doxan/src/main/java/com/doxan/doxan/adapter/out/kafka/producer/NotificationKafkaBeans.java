package com.doxan.doxan.adapter.out.kafka.producer;

import com.doxan.doxan.domain.model.Notification;
import com.doxan.doxan.infrastructure.config.KafkaConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class NotificationKafkaBeans {
    private final KafkaConfig kafkaConfig;

    public NotificationKafkaBeans(KafkaConfig kafkaConfig) {
        this.kafkaConfig = kafkaConfig;
    }

    @Bean
    public KafkaTemplate<String, Notification> kafkaNotificationTemplate() {
        return kafkaConfig.kafkaTemplate(Notification.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Notification> notificationKafkaListenerContainerFactory() {
        return kafkaConfig.kafkaListenerContainerFactory(Notification.class, "notification-group");
    }
}
