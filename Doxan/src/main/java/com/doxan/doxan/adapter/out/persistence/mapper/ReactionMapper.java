package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaReactionEntity;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.ReactionMapperHelper;
import com.doxan.doxan.domain.model.Reaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ReactionMapperHelper.class})
public interface ReactionMapper {

    @Mapping(target = "targetId", source = "id.targetId")
    Reaction toDomain(JpaReactionEntity entity);

    @Mapping(target = "id", source = ".", qualifiedByName = "buildId")
    JpaReactionEntity toEntity(Reaction domain);
}
