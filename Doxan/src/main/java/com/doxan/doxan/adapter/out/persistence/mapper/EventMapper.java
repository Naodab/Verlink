package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaEventEntity;
import com.doxan.doxan.domain.model.Event;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {

    Event toDomain(JpaEventEntity entity);
    JpaEventEntity toEntity(Event domain);
}
