package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaBlockRelationshipEntityId;
import com.doxan.doxan.domain.model.BlockRelationship;
import org.mapstruct.Named;

public class BlockRelationshipMapperHelper {
    BlockRelationshipMapperHelper() {}

    @Named("buildId")
    public static JpaBlockRelationshipEntityId buildId(BlockRelationship block) {
        return JpaBlockRelationshipEntityId.builder()
                .blockedId(block.getBlocked().getId())
                .blockerId(block.getBlocker().getId())
                .build();
    }
}
