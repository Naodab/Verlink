package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.mapper.helper.FriendshipMapperHelper;
import com.doxan.doxan.domain.model.Friendship;
import com.doxan.doxan.adapter.out.persistence.entity.JpaFriendshipEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FriendshipMapperHelper.class})
public interface FriendshipMapper {

    Friendship toDomain(JpaFriendshipEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaFriendshipEntity toEntity(Friendship domain);
}
