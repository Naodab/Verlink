package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaFriendshipEntity;
import com.doxan.doxan.domain.model.Friendship;
import org.mapstruct.Named;

public class FriendshipMapperHelper {
    FriendshipMapperHelper() {}

    @Named("buildId")
    public static JpaFriendshipEntity.FriendshipId buildId(Friendship friendship) {
        return new JpaFriendshipEntity.FriendshipId(
                friendship.getRequester().getId(),
                friendship.getAccepter().getId()
        );
    }
}
