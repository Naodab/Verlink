package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaStickerItemEntity;
import com.doxan.doxan.domain.model.StickerItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StickerItemMapper {
    StickerItem toDomain(JpaStickerItemEntity entity);
    JpaStickerItemEntity toEntity(StickerItem domain);
}
