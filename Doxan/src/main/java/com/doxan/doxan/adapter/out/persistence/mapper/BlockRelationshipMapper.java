package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaBlockRelationshipEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.BlockRelationshipMapperHelper;
import com.doxan.doxan.domain.model.BlockRelationship;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses = {BlockRelationshipMapperHelper.class})
public interface BlockRelationshipMapper {

    BlockRelationship toDomain(JpaBlockRelationshipEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaBlockRelationshipEntity toEntity(BlockRelationship domain);
}
