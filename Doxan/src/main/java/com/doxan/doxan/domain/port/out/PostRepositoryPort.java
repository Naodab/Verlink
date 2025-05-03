package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.Post;

import java.util.List;
import java.util.Optional;

public interface PostRepositoryPort {
    Optional<Post> findById(String id);
    Post save(Post post);
    List<Post> findAllByTargetIdWithPagination(String targetId, int offset, int limit);
    void deleteById(String id);
}
