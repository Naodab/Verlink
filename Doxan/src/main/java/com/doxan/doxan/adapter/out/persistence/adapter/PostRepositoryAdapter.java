package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.PostMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaPostRepository;
import com.doxan.doxan.domain.model.Post;
import com.doxan.doxan.domain.port.out.PostRepositoryPort;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PostRepositoryAdapter implements PostRepositoryPort {
    private final JpaPostRepository jpaPostRepository;
    private final PostMapper postMapper;

    public PostRepositoryAdapter(final JpaPostRepository jpaPostRepository,
                          final PostMapper postMapper) {
        this.jpaPostRepository = jpaPostRepository;
        this.postMapper = postMapper;
    }

    @Override
    public Optional<Post> findById(String id) {
        return Optional.empty();
    }

    @Override
    public Post save(Post post) {
        return postMapper.toDomain(jpaPostRepository.save(postMapper.toEntity(post)));
    }

    @Override
    @Transactional
    public List<Post> findAllByTargetId(String targetId) {
        return jpaPostRepository.findByTargetId(targetId).stream()
                .map(postMapper::toDomain).toList();
    }

    @Override
    public List<Post> findAllByTargetIdWithPagination(String targetId, int offset, int limit) {
        return jpaPostRepository.findByTargetIdWithPagination(targetId, offset, limit)
                .stream().map(postMapper::toDomain).toList();
    }

    @Override
    public void deleteById(String id) {
        jpaPostRepository.deleteById(id);
    }
}
