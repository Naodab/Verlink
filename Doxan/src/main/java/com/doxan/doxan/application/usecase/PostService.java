package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.MediaDTOMapper;
import com.doxan.doxan.domain.dto.mapper.PostDTOMapper;
import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.request.post.PostUpdateRequest;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.model.Post;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.port.in.PostUseCase;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import com.doxan.doxan.domain.port.out.MediaUploader;
import com.doxan.doxan.domain.port.out.PostRepositoryPort;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService implements PostUseCase {
    private final MediaRepositoryPort mediaRepository;
    private final PostRepositoryPort postRepository;
    private final MediaUploader mediaUploader;
    private final PostDTOMapper postDTOMapper;
    private final UserRepositoryPort userRepository;
    private final MediaDTOMapper mediaDTOMapper;
    private final MediaService mediaService;

    public PostService(final UserRepositoryPort userRepository,
                       final MediaRepositoryPort mediaRepository,
                       final PostRepositoryPort postRepository,
                       final MediaUploader mediaUploader,
                       final PostDTOMapper postDTOMapper,
                       final MediaDTOMapper mediaDTOMapper,
                       final MediaService mediaService) {
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
        this.postRepository = postRepository;
        this.mediaUploader = mediaUploader;
        this.postDTOMapper = postDTOMapper;
        this.mediaDTOMapper = mediaDTOMapper;
        this.mediaService = mediaService;
    }

    @Override
    public PostResponse create(PostCreateRequest request, List<UploadFile> files) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Post post = postDTOMapper.fromCreateRequest(request);
        post.setUser(user);
        post = postRepository.save(post);
        String finalPostId = post.getId();
        PostResponse postResponse = postDTOMapper.fromPost(post);
        if (!files.isEmpty()) {
            postResponse.setMedias(files.stream()
                    .map(file -> mediaDTOMapper.toResponse(mediaRepository.save(
                            mediaUploader.upload(file, finalPostId, MediaTargetType.POST))
                    )).toList());
        }
        return postResponse;
    }

    @Override
    public PostResponse update(String id, PostUpdateRequest request, List<UploadFile> files) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Post post = postRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.POST_NOT_EXISTED));
        if (!post.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.POST_EDITING_NOT_PERMITTED);
        }
        post.setContent(request.getContent());
        post.setVisibility(request.getVisibility());

        List<Media> mediaExisting = mediaRepository.findAllByTargetId(id);
        Set<String> keepIds = new HashSet<>(request.getKeepMediaIds());
        mediaExisting.stream()
                .filter(media -> !keepIds.contains(media.getId()))
                .forEach(media -> {
                    mediaService.deleteById(media.getUrl());
                    mediaRepository.deleteById(media.getId());
                });

        List<Media> finalMedia = new ArrayList<>(mediaRepository.findAllByIds(request.getKeepMediaIds()));
        if (!files.isEmpty()) {
            finalMedia.addAll(files.stream()
                    .map(file -> mediaUploader.upload(file, id, MediaTargetType.POST))
                    .map(mediaRepository::save)
                    .toList());
        }

        postRepository.save(post);
        PostResponse postResponse = postDTOMapper.fromPost(post);
        postResponse.setMedias(finalMedia.stream()
                .map(mediaDTOMapper::toResponse).collect(Collectors.toList()));
        return postResponse;
    }

    @Override
    public void deleteById(String id) {
        mediaRepository.findAllByTargetId(id).forEach(media -> mediaRepository.deleteById(media.getId()));
        postRepository.deleteById(id);
    }

    @Override
    public PostResponse getById(String id) {
        PostResponse result = postDTOMapper.fromPost(postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED)));
        result.setMedias(mediaRepository.findAllByTargetId(id).stream()
                .map(mediaDTOMapper::toResponse).collect(Collectors.toList()));
        return result;
    }

    @Override
    public List<PostResponse> getAllFromTargetIdWithPage(String targetId, int offset, int limit) {
        return List.of();
    }

    @Override
    public List<PostResponse> findByContentPage(String content, int offset, int limit) {
        return List.of();
    }

}
