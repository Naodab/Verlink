package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Notification;

import java.util.List;

public interface NotificationRepositoryPort {
    Notification save(Notification notification);
    List<Notification> findByRecipientId(String recipientId);
    List<Notification> findByRecipientIdWithPagination(String recipientId, int offset, int limit);
    List<Notification> findByRecipientIdAndRead(String recipientId, boolean read);
    List<Notification> findByRecipientIdAndReadWithPagination(String recipientId, boolean read, int offset, int limit);
    long countByRecipientIdAndRead(String recipientId, boolean read);
}
