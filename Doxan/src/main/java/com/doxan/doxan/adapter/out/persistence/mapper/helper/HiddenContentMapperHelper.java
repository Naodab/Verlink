package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaHiddenContentEntity;
import com.doxan.doxan.domain.model.HiddenContent;
import org.mapstruct.Named;

public class HiddenContentMapperHelper {
    HiddenContentMapperHelper() {}

    @Named("buildId")
    public static JpaHiddenContentEntity.JpaHiddenContentEntityId buildId(HiddenContent content) {
        return JpaHiddenContentEntity.JpaHiddenContentEntityId.builder()
                .userId(content.getUser().getId())
                .targetId(content.getTargetId())
                .build();
    }
}
