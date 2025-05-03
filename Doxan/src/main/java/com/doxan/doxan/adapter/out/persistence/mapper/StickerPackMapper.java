package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaStickerPackEntity;
import com.doxan.doxan.domain.model.StickerPack;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StickerPackMapper {
    StickerPack toDomain(JpaStickerPackEntity entity);
    JpaStickerPackEntity toEntity(StickerPack domain);
}
