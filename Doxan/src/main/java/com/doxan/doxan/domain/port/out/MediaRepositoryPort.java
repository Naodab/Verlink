package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Media;

import java.util.List;
import java.util.Optional;

public interface MediaRepositoryPort {
    Media save(Media media);
    Optional<Media> findById(String id);
    List<Media> findAllByTargetId(String targetId);
    List<Media> findAllByIds(List<String> mediaIds);
    void deleteById(String id);
}
