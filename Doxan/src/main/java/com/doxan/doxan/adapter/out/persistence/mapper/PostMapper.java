package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaPostEntity;
import com.doxan.doxan.domain.model.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    Post toDomain(JpaPostEntity entity);
    JpaPostEntity toEntity(Post domain);
}
