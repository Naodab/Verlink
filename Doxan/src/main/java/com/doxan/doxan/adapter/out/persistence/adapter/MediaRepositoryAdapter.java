package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MediaRepositoryAdapter implements MediaRepositoryPort {
    @Override
    public Media save(Media media) {
        return null;
    }

    @Override
    public Optional<Media> findById(String id) {
        return Optional.empty();
    }

    @Override
    public List<Media> findAllByTargetId(String targetId) {
        return List.of();
    }

    @Override
    public List<Media> findAllByIds(List<String> mediaIds) {
        return List.of();
    }

    @Override
    public void deleteById(String id) {

    }
}
