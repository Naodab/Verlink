package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.domain.model.Location;
import com.doxan.doxan.adapter.out.persistence.entity.JpaLocationEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    Location toDomain(JpaLocationEntity entity);
    JpaLocationEntity toEntity(Location domain);
}
