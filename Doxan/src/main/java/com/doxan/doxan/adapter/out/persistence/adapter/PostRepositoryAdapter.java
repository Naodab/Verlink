package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.domain.model.Post;
import com.doxan.doxan.domain.port.out.PostRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PostRepositoryAdapter implements PostRepositoryPort {


    @Override
    public Optional<Post> findById(String id) {
        return Optional.empty();
    }

    @Override
    public Post save(Post post) {
        return null;
    }

    @Override
    public List<Post> findAllByTargetIdWithPagination(String targetId, int offset, int limit) {
        return List.of();
    }

    @Override
    public void deleteById(String id) {

    }
}
