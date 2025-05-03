package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaFollowEntity;
import com.doxan.doxan.domain.model.Follow;
import org.mapstruct.Named;

public class FollowMapperHelper {
    FollowMapperHelper()  {}

    @Named("buildId")
    public static JpaFollowEntity.JpaFollowEntityId buildId(Follow follow) {
        return JpaFollowEntity.JpaFollowEntityId.builder()
                .followerId(follow.getFollower().getId())
                .targetId(follow.getTargetId())
                .build();
    }
}
