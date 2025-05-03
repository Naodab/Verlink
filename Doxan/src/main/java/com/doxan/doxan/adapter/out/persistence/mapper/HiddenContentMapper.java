package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaHiddenContentEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.HiddenContentMapperHelper;
import com.doxan.doxan.domain.model.HiddenContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { HiddenContentMapperHelper.class })
public interface HiddenContentMapper {
    @Mapping(target = "targetId", source = "id.targetId")
    HiddenContent toDomain(JpaHiddenContentEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaHiddenContentEntity toEntity(HiddenContent domain);
}
