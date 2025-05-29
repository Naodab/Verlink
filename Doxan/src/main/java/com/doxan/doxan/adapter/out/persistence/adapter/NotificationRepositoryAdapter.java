package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.NotificationMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaNotificationRepository;
import com.doxan.doxan.domain.model.Notification;
import com.doxan.doxan.domain.port.out.NotificationRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationRepositoryAdapter implements NotificationRepositoryPort {

    private final JpaNotificationRepository jpaNotificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationRepositoryAdapter(final JpaNotificationRepository jpaNotificationRepository,
                                         final NotificationMapper notificationMapper) {
        this.jpaNotificationRepository = jpaNotificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public Notification save(Notification notification) {
        return notificationMapper.toDomain(jpaNotificationRepository
                .save(notificationMapper.toEntity(notification)));
    }

    @Override
    public List<Notification> findByRecipientId(String recipientId) {
        return jpaNotificationRepository.findByRecipientId(recipientId)
                .stream().map(notificationMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Notification> findByRecipientIdWithPagination(String recipientId, int offset, int limit) {
        return jpaNotificationRepository.findByRecipientIdWithPagination(recipientId, offset, limit)
                .stream().map(notificationMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Notification> findByRecipientIdAndRead(String recipientId, boolean read) {
        return jpaNotificationRepository.findByRecipientIdAndRead(recipientId, read)
                .stream().map(notificationMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Notification> findByRecipientIdAndReadWithPagination(
            String recipientId,
            boolean read,
            int offset,
            int limit
    ) {
        return jpaNotificationRepository.findByRecipientIdAndReadWithPagination(recipientId, read, offset, limit)
                .stream().map(notificationMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public long countByRecipientIdAndRead(String recipientId, boolean read) {
        return jpaNotificationRepository.countByRecipientIdAndRead(recipientId, read);
    }
}
