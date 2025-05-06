package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.adapter.out.fileupload.SpringUploadFile;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.file.UploadFile;
import com.doxan.doxan.domain.port.in.PostUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
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
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "videos", required = false) MultipartFile[] videos
    ) {
        List<UploadFile> imageUploadFiles = images == null ? List.of()
                : Arrays.stream(images).map(image -> (UploadFile) new SpringUploadFile(image)).toList();

        List<UploadFile> videoUploadFiles = videos == null ? List.of()
                : Arrays.stream(videos).map(video -> (UploadFile) new SpringUploadFile(video)).toList();

        log.info(location);

//        return ApiResponse.<PostResponse>builder()
//                .data(postUseCase.create(content, imageUploadFiles, videoUploadFiles))
//                .build();
        return null;
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
