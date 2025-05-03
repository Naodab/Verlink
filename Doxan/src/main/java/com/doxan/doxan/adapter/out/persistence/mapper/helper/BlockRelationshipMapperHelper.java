package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.BlockRelationshipId;
import com.doxan.doxan.domain.model.BlockRelationship;
import org.mapstruct.Named;

public class BlockRelationshipMapperHelper {
    BlockRelationshipMapperHelper() {}

    @Named("buildId")
    public static BlockRelationshipId buildId(BlockRelationship block) {
        return BlockRelationshipId.builder()
                .blockedId(block.getBlocked().getId())
                .blockerId(block.getBlocker().getId())
                .build();
    }
}
