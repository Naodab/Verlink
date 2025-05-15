package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.adapter.out.fileupload.SpringUploadFile;
import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.model.enums.Visibility;
import com.doxan.doxan.domain.port.in.PostUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostUseCase postUseCase;

    public PostController(final PostUseCase postUseCase) {
        this.postUseCase = postUseCase;
    }

    @PostMapping
    public ApiResponse<PostResponse> create(
            @RequestParam("content") String content,
            @RequestParam("visibility") String visibility,
            @RequestParam("targetId") String targetId,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "videos", required = false) List<MultipartFile> videos,
            @RequestParam(value = "docs", required = false) List<MultipartFile> docs
    ) {
        PostCreateRequest request = PostCreateRequest.builder()
                .content(content)
                .visibility(Visibility.valueOf(visibility))
                .targetId(targetId)
                .build();
        if (images != null && !images.isEmpty()) {
            request.setImages(images.stream().map(image -> (UploadFile) new SpringUploadFile(image)).toList());
        }
        if (videos != null && !videos.isEmpty()) {
            request.setImages(videos.stream().map(video -> (UploadFile) new SpringUploadFile(video)).toList());
        }
        if (docs != null && !docs.isEmpty()) {
            request.setImages(docs.stream().map(image -> (UploadFile) new SpringUploadFile(image)).toList());
        }

        log.info(location);

        return ApiResponse.<PostResponse>builder()
                .data(postUseCase.create(request))
                .build();
    }

    @GetMapping("/my-posts")
    public ApiResponse<List<PostResponse>> getMyPosts() {
        return ApiResponse.<List<PostResponse>>builder()
                .data(postUseCase.getMyPosts())
                .build();
    }

    @GetMapping("/of-users-{userId}")
    public ApiResponse<List<PostResponse>> getOfUsers(@PathVariable("userId") String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .data(postUseCase.getOfUserIds(userId))
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> get(@PathVariable("postId") String postId) {
        return ApiResponse.<PostResponse>builder()
                .data(postUseCase.getById(postId))
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> delete(@PathVariable("postId") String postId) {
        postUseCase.deleteById(postId);
        return ApiResponse.<Void>builder().build();
    }
}
