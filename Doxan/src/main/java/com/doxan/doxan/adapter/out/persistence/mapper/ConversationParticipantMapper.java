package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaConversationParticipantEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.ConversationParticipantMapperHelper;
import com.doxan.doxan.domain.model.ConversationParticipant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ConversationParticipantMapperHelper.class, ConversationMapper.class, UserMapper.class})
public interface ConversationParticipantMapper {
    ConversationParticipant toDomain(JpaConversationParticipantEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaConversationParticipantEntity toEntity(ConversationParticipant domain);
}
