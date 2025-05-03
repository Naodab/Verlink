package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaCommentEntity;
import com.doxan.doxan.domain.model.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toDomain(JpaCommentEntity entity);
    JpaCommentEntity toEntity(Comment domain);
}
