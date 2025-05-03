package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.domain.model.Permission;
import com.doxan.doxan.adapter.out.persistence.entity.JpaPermissionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toDomain(JpaPermissionEntity entity);
    JpaPermissionEntity  toEntity(Permission domain);
}
