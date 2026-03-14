package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JpaMediaRepository extends JpaRepository<JpaMediaEntity, String> {
    List<JpaMediaEntity> findByTargetId(String targetId);
    void deleteByTargetId(String targetId);

    @Query("SELECT m from medias m where m.id in :ids")
    List<JpaMediaEntity> findAllByIds(List<String> ids);
}
