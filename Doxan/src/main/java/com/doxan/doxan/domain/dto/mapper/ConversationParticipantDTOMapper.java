package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.response.user.ParticipantConversationResponse;
import com.doxan.doxan.domain.model.ConversationParticipant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MediaDTOMapper.class)
public interface ConversationParticipantDTOMapper {
    @Mapping(target = "nickname", source = "name")
    @Mapping(target = "id", source = "user.id")
    ParticipantConversationResponse toResponse(ConversationParticipant participant);
}
