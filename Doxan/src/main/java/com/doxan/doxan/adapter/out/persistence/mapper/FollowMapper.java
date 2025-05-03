package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaFollowEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.FollowMapperHelper;
import com.doxan.doxan.domain.model.Follow;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FollowMapperHelper.class})
public interface FollowMapper {
    @Mapping(target = "targetId", source = "id.targetId")
    Follow toDomain(JpaFollowEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaFollowEntity toDomain(Follow domain);
}
