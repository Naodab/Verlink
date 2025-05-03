package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.response.friendship.FriendshipResponse;
import com.doxan.doxan.domain.model.Friendship;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FriendshipDTOMapper {
    FriendshipResponse toResponse(Friendship friendship);
}
