package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.MediaDTOMapper;
import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.port.in.MediaUseCase;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import com.doxan.doxan.domain.port.out.MediaUploader;
import com.doxan.doxan.domain.utils.UrlUntil;
import org.springframework.stereotype.Service;

@Service
public class MediaService implements MediaUseCase {
    private final MediaRepositoryPort mediaRepository;
    private final MediaDTOMapper mediaDTOMapper;
    private final MediaUploader mediaUploader;

    public MediaService(final MediaRepositoryPort mediaRepositoryPort,
                        final MediaDTOMapper mediaDTOMapper,
                        final MediaUploader mediaUploader) {
        this.mediaRepository = mediaRepositoryPort;
        this.mediaDTOMapper = mediaDTOMapper;
        this.mediaUploader = mediaUploader;
    }

    @Override
    public MediaResponse create(Media media) {
        return mediaDTOMapper.toResponse(mediaRepository.save(media));
    }

    @Override
    public void deleteById(String id) {
        Media media = mediaRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.MEDIA_NOT_EXISTED));
        mediaUploader.delete(UrlUntil.extractPublicId(media.getUrl()));
        mediaRepository.deleteById(id);
    }
}
