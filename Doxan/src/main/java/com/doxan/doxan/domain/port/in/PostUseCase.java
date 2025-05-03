package com.doxan.doxan.domain.port.in;

import com.doxan.doxan.domain.dto.request.post.PostCreateRequest;
import com.doxan.doxan.domain.dto.request.post.PostUpdateRequest;
import com.doxan.doxan.domain.dto.response.post.PostResponse;
import com.doxan.doxan.domain.file.UploadFile;

import java.util.List;

public interface PostUseCase {
    PostResponse create(PostCreateRequest request, List<UploadFile> files);
    PostResponse update(String id, PostUpdateRequest request, List<UploadFile> files);
    void deleteById(String id);
    PostResponse getById(String id);
    List<PostResponse> getAllFromTargetIdWithPage(String targetId, int offset, int limit);
    List<PostResponse> findByContentPage(String content, int offset, int limit);
}
