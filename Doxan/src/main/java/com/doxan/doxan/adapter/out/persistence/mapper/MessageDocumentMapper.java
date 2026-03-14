package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.document.MessageDocument;
import com.doxan.doxan.adapter.out.persistence.mapper.helper.MessageDocumentMapperHelper;
import com.doxan.doxan.domain.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MessageDocumentMapperHelper.class)
public interface MessageDocumentMapper {

    @Mapping(target = "medias", source = "mediaIds", qualifiedByName = "mapMediaIdsToMedias")
    Message toDomain(MessageDocument document);

    @Mapping(target = "mediaIds", source = "medias", qualifiedByName = "mapMediasToMediaIds")
    MessageDocument toDocument(Message message);
}
