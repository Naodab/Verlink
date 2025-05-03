package com.doxan.doxan.domain.dto.mapper;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.model.Media;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MediaDTOMapper {
    MediaResponse toResponse(Media media);
}
