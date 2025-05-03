package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaMediaEntity;
import com.doxan.doxan.domain.model.Media;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MediaMapper {
    Media toDomain(JpaMediaEntity entity);
    JpaMediaEntity toEntity(Media domain);
}
