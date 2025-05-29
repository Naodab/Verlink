package com.doxan.doxan.application.usecase;

import com.doxan.doxan.domain.dto.mapper.MediaDTOMapper;
import com.doxan.doxan.domain.dto.mapper.PostDTOMapper;
import com.doxan.doxan.domain.dto.request.UploadFileRequest;
import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.request.post.PostUpdateRequest;
import com.doxan.doxan.domain.dto.response.UploadFileResponse;
import com.doxan.doxan.domain.dto.response.media.MediaResponse;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.exception.AppException;
import com.doxan.doxan.domain.exception.ErrorCode;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.Media;
import com.doxan.doxan.domain.model.Post;
import com.doxan.doxan.domain.model.User;
import com.doxan.doxan.domain.model.enums.MediaTargetType;
import com.doxan.doxan.domain.model.enums.MediaType;
import com.doxan.doxan.domain.model.enums.Visibility;
import com.doxan.doxan.domain.port.in.PostUseCase;
import com.doxan.doxan.domain.port.out.MediaRepositoryPort;
import com.doxan.doxan.domain.port.out.MediaUploader;
import com.doxan.doxan.domain.port.out.PostRepositoryPort;
import com.doxan.doxan.domain.port.out.UserRepositoryPort;
import com.doxan.doxan.domain.utils.UrlUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PostService implements PostUseCase {
    private final MediaRepositoryPort mediaRepository;
    private final PostRepositoryPort postRepository;
    private final MediaUploader mediaUploader;
    private final PostDTOMapper postDTOMapper;
    private final UserRepositoryPort userRepository;
    private final MediaDTOMapper mediaDTOMapper;
    private final MediaService mediaService;
    private final UploadFileService uploadFileService;

    public PostService(final UserRepositoryPort userRepository,
                       final MediaRepositoryPort mediaRepository,
                       final PostRepositoryPort postRepository,
                       final MediaUploader mediaUploader,
                       final PostDTOMapper postDTOMapper,
                       final MediaDTOMapper mediaDTOMapper,
                       final MediaService mediaService,
                       final UploadFileService uploadFileService) {
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
        this.postRepository = postRepository;
        this.mediaUploader = mediaUploader;
        this.postDTOMapper = postDTOMapper;
        this.mediaDTOMapper = mediaDTOMapper;
        this.mediaService = mediaService;
        this.uploadFileService = uploadFileService;
    }

    @Override
    @Transactional
    public PostResponse create(PostCreateRequest request) {
        User user = userRepository.findById(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Post post = Post.builder()
                .content(request.getContent())
                .user(user)
                .targetId(request.getTargetId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .visibility(request.getVisibility())
                .build();
        post = postRepository.save(post);
        PostResponse postResponse = postDTOMapper.toResponse(post);
        UploadFileResponse uploadFileResponse = uploadFileService.uploadFile(post.getId(), UploadFileRequest.builder()
                        .images(request.getImages())
                        .docs(request.getDocs())
                        .videos(request.getVideos())
                .build(), MediaTargetType.POST);
        postResponse.setImages(uploadFileResponse.getImages());
        postResponse.setDocs(uploadFileResponse.getDocs());
        postResponse.setVideos(uploadFileResponse.getVideos());
        return postResponse;
    }

    @Override
    @Transactional
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
        PostResponse postResponse = postDTOMapper.toResponse(post);
        postResponse.setImages(finalMedia.stream()
                .map(mediaDTOMapper::toResponse).toList());
        return postResponse;
    }

    @Override
    public void deleteById(String id) {
        mediaRepository.findAllByTargetId(id).forEach(media -> {
            mediaUploader.delete(UrlUtil.extractPublicId(media.getUrl()), media.getMediaType());
            mediaRepository.deleteById(media.getId());
        });
        postRepository.deleteById(id);
    }

    @Override
    public List<PostResponse> getMyPosts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return getOfUserIds(userId);
    }

    @Override
    public List<PostResponse> getOfUserIds(String userId) {
        List<Post> posts = postRepository.findAllByTargetId(userId);
        List<PostResponse> postResponses = posts.stream().map(postDTOMapper::toResponse).toList();
        postResponses.forEach(post -> {
            List<Media> medias = mediaRepository.findAllByTargetId(post.getId());
            List<MediaResponse> images = new ArrayList<>();
            List<MediaResponse> videos = new ArrayList<>();
            List<MediaResponse> docs = new ArrayList<>();
            medias.forEach(media -> {
                if (MediaType.IMAGE.equals(media.getMediaType())) {
                    images.add(mediaDTOMapper.toResponse(media));
                } else if (MediaType.VIDEO.equals(media.getMediaType())) {
                    videos.add(mediaDTOMapper.toResponse(media));
                } else if (MediaType.DOCUMENT.equals(media.getMediaType())) {
                    docs.add(mediaDTOMapper.toResponse(media));
                }
            });
            post.setImages(images);
            post.setVideos(videos);
            post.setDocs(docs);
        });
        return postResponses;
    }

    @Override
    public PostResponse getById(String id) {
        PostResponse result = postDTOMapper.toResponse(postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED)));
        result.setImages(mediaRepository.findAllByTargetId(id).stream()
                .map(mediaDTOMapper::toResponse).toList());
        return result;
    }

    @Override
    public List<PostResponse> getAllFromTargetIdWithPage(String targetId, int offset, int limit) {
        return postRepository.findAllByTargetIdWithPagination(targetId, offset, limit)
                .stream().map(postDTOMapper::toResponse).toList();
    }

    @Override
    public List<PostResponse> findByContentPage(String content, int offset, int limit) {
        return List.of();
    }

}
