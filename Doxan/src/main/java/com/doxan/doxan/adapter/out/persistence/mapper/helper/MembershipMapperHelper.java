package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaMembershipEntity;
import com.doxan.doxan.domain.model.Membership;
import org.mapstruct.Named;

public class MembershipMapperHelper {
    MembershipMapperHelper() {}

    @Named("buildId")
    public static JpaMembershipEntity.MembershipEntityId buildId(Membership membership) {
        return JpaMembershipEntity.MembershipEntityId.builder()
                .groupId(membership.getGroup().getId())
                .userId(membership.getUser().getId())
                .build();
    }
}
