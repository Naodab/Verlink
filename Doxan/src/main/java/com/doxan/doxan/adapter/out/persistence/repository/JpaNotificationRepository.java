package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaNotificationEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaNotificationRepository extends JpaRepository<JpaNotificationEntity, String> {
    @Query("SELECT n FROM notifications n WHERE n.recipient.id = :recipientId ORDER BY n.createdAt")
    List<JpaNotificationEntity> findByRecipientId(@Param("recipientId") String recipientId);

    @Query("SELECT n FROM notifications n " +
            "WHERE n.recipient.id = :recipientId " +
            "ORDER BY n.createdAt " +
            "LIMIT :limit OFFSET :offset")
    List<JpaNotificationEntity> findByRecipientIdWithPagination(
            @Param("recipientId") String recipientId,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    @Query("SELECT n FROM notifications n " +
            "WHERE n.recipient.id = :recipientId AND n.read = :read " +
            "ORDER BY n.createdAt")
    List<JpaNotificationEntity> findByRecipientIdAndRead(
            @Param("recipientId") String recipientId,
            @Param("read") boolean read
    );

    @Query("SELECT n FROM notifications n " +
            "WHERE n.recipient.id = :recipientId AND n.read = :read " +
            "ORDER BY n.createdAt " +
            "LIMIT :limit " +
            "OFFSET :offset")
    List<JpaNotificationEntity> findByRecipientIdAndReadWithPagination(
            @Param("recipientId") String recipientId,
            @Param("read") boolean read,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    @Query("SELECT COUNT(*) FROM notifications n WHERE n.recipient.id = :recipientId AND n.read = :read")
    long countByRecipientIdAndRead(@Param("recipientId") String recipientId,
                                   @Param("read") boolean read);
}
