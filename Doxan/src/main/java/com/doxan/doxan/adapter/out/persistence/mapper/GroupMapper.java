package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaGroupEntity;
import com.doxan.doxan.domain.model.Group;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GroupMapper {
    Group toDomain(JpaGroupEntity entity);
    JpaGroupEntity toEntity(Group domain);
}
