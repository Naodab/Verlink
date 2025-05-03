package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.model.Media;

public interface MediaUseCase {
    MediaResponse create(Media media);
    void deleteById(String id);
}
