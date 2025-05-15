package com.doxan.doxan.adapter.out.persistence.mapper.helper;

import com.doxan.doxan.domain.model.Media;
import org.mapstruct.Named;

import java.util.List;

public class MessageDocumentMapperHelper {
    private MessageDocumentMapperHelper() {}

    @Named("mapMediasToMediaIds")
    public static List<String> mapMediasToMediaIds(List<Media> medias) {
        if (medias.isEmpty()) return List.of();
        return medias.stream().map(Media::getId).toList();
    }

    @Named("mapMediaIdsToMedias")
    public static List<Media> mapMediaIdsToMedias(List<String> mediaIds) {
        if (mediaIds.isEmpty()) return List.of();
        return mediaIds.stream().map(id -> Media.builder().id(id).build()).toList();
    }
}
