package com.doxan.doxan.adapter.in.web.controller;

import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.response.ApiResponse;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.port.in.PostUseCase;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostUseCase postUseCase;

    public PostController(final PostUseCase postUseCase) {
        this.postUseCase = postUseCase;
    }

    @PostMapping
    public ApiResponse<PostResponse> create(@RequestBody PostCreateRequest request) {
        return ApiResponse.<PostResponse>builder()
                .data(postUseCase.create(request, null))
                .build();
    }
}
