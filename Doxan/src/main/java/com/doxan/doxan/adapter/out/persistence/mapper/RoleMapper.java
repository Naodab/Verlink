package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.domain.model.Role;
import com.doxan.doxan.adapter.out.persistence.entity.JpaRoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", source = "permissions")
    Role toDomain(JpaRoleEntity entity);

    @Mapping(target = "permissions", source = "permissions")
    JpaRoleEntity toEntity(Role domain);
}
