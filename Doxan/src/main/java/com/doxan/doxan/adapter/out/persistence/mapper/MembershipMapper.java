package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaMembershipEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.MembershipMapperHelper;
import com.doxan.doxan.domain.model.Membership;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",  uses = {MembershipMapperHelper.class })
public interface MembershipMapper {
    Membership toDomain(JpaMembershipEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaMembershipEntity toEntity(Membership domain);
}
