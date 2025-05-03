package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaReactionEntity;
import com.doxan.doxan.domain.model.Reaction;
import org.mapstruct.Named;

public class ReactionMapperHelper {
    ReactionMapperHelper() {}

    @Named("buildId")
    public static JpaReactionEntity.JpaReactionEntityId buildId(Reaction reaction) {
        return JpaReactionEntity.JpaReactionEntityId.builder()
                .targetId(reaction.getTargetId())
                .userId(reaction.getUser().getId())
                .build();
    }
}
