package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.MediaDTOMapper;
import com.doxan.doxan.domain.dto.request.UploadFileRequest;
import com.doxan.doxan.domain.dto.response.UploadFileResponse;
import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import com.doxan.doxan.domain.port.out.MediaUploader;
import org.springframework.stereotype.Service;

@Service
public class UploadFileService {
    private final MediaRepositoryPort mediaRepository;
    private final MediaUploader mediaUploader;
    private final MediaDTOMapper mediaDTOMapper;

    public UploadFileService(final MediaRepositoryPort mediaRepository,
                             final MediaUploader mediaUploader,
                             final MediaDTOMapper mediaDTOMapper) {
        this.mediaRepository = mediaRepository;
        this.mediaUploader = mediaUploader;
        this.mediaDTOMapper = mediaDTOMapper;
    }

    public UploadFileResponse uploadFile(String targetId, UploadFileRequest request, MediaTargetType type) {
        UploadFileResponse response = new UploadFileResponse();
        if (!request.getImages().isEmpty()) {
            response.setImages(request.getImages().stream().map(image ->
                    mediaDTOMapper.toResponse(mediaRepository.save(
                        mediaUploader.upload(image, targetId, type)
                    ))).toList());
        }
        if (!request.getVideos().isEmpty()) {
            response.setVideos(request.getVideos().stream().map(video ->
                    mediaDTOMapper.toResponse(mediaRepository.save(
                            mediaUploader.upload(video, targetId, type)
                    ))).toList());
        }
        if (!request.getDocs().isEmpty()) {
            response.setDocs(request.getDocs().stream().map(doc ->
                    mediaDTOMapper.toResponse(mediaRepository.save(
                            mediaUploader.upload(doc, targetId, type)
                    ))).toList());
        }
        return response;
    }
}
