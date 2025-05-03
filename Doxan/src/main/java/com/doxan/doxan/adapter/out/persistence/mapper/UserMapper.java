package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.adapter.out.persistence.entity.JpaUserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "location", source = "location")
    @Mapping(target = "roles", source = "roles")
    User toDomain(JpaUserEntity entity);

    @Mapping(target = "location", source = "location")
    @Mapping(target = "roles", source = "roles")
    JpaUserEntity toEntity(User domain);
}
