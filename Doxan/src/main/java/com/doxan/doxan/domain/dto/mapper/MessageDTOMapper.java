package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.message.MessageOneToOneCreateRequest;
import com.doxan.doxan.domain.dto.response.message.MessageResponse;
import com.doxan.doxan.domain.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MediaDTOMapper.class, UserDTOMapper.class})
public interface MessageDTOMapper {
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "docs", ignore = true)
    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "recipients", ignore = true)
    MessageResponse toResponse(Message message);

    @Mapping(target = "senderId", ignore = true)
    @Mapping(target = "medias", ignore = true)
    @Mapping(target = "reactionCounts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Message fromCreateRequest(MessageOneToOneCreateRequest request);
}
