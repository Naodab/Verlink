package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationEntity;
import com.doxan.doxan.domain.model.Conversation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ConversationMapper {
    Conversation toDomain(JpaConversationEntity entity);
    JpaConversationEntity toEntity(Conversation conversation);
}
