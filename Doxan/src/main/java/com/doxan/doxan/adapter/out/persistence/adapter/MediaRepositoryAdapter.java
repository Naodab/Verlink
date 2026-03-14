package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.MediaMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaMediaRepository;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class MediaRepositoryAdapter implements MediaRepositoryPort {
    private final JpaMediaRepository jpaMediaRepository;
    private final MediaMapper mediaMapper;

    public MediaRepositoryAdapter(JpaMediaRepository jpaMediaRepository,
                                  MediaMapper mediaMapper) {
        this.jpaMediaRepository = jpaMediaRepository;
        this.mediaMapper = mediaMapper;
    }

    @Override
    public Media save(Media media) {
        return mediaMapper.toDomain(jpaMediaRepository.save(mediaMapper.toEntity(media)));
    }

    @Override
    public Optional<Media> findById(String id) {
        return jpaMediaRepository.findById(id).map(mediaMapper::toDomain);
    }

    @Override
    public List<Media> findAllByTargetId(String targetId) {
        return jpaMediaRepository.findByTargetId(targetId).stream()
                .map(mediaMapper::toDomain).toList();
    }

    @Override
    public List<Media> findAllByIds(List<String> mediaIds) {
        return jpaMediaRepository.findAllByIds(mediaIds)
                .stream().map(mediaMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(String id) {
        jpaMediaRepository.deleteById(id);
    }

    @Override
    public void deleteAllByTargetId(String targetId) {
        jpaMediaRepository.deleteByTargetId(targetId);
    }
}
