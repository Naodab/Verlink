package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaPageEntity;
import com.doxan.doxan.domain.model.Page;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PageMapper {

    @Mapping(target = "admins",  source = "admins")
    Page toDomain(JpaPageEntity entity);


    @Mapping(target = "admins",  source = "admins")
    JpaPageEntity toEntity(Page domain);
}
