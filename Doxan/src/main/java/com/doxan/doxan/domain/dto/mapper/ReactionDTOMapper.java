package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.request.reaction.ReactionCreateRequest;
import com.doxan.doxan.domain.dto.response.reaction.ReactionResponse;
import com.doxan.doxan.domain.model.Reaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = UserDTOMapper.class)
public interface ReactionDTOMapper {
    @Mapping(target = "reactionType", source = "fellingType")
    ReactionResponse toResponse(Reaction reaction);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "fellingType", source = "reactionType")
    Reaction fromCreateRequest(ReactionCreateRequest request);
}
