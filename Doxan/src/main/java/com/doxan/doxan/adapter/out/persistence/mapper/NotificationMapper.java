package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaNotificationEntity;
import com.doxan.doxan.domain.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toDomain(JpaNotificationEntity entity);
    JpaNotificationEntity toEntity(Notification domain);
}
