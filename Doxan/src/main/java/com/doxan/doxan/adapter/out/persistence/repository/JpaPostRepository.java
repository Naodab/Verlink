package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaPostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaPostRepository extends JpaRepository<JpaPostEntity, String> {
    List<JpaPostEntity> findByTargetId(String targetId);

    @Query("SELECT p from posts p WHERE p.targetId = :targetId ORDER BY p.createdAt DESC LIMIT :limit OFFSET :offset")
    List<JpaPostEntity> findByTargetIdWithPagination(String targetId, int offset, int limit);
}
