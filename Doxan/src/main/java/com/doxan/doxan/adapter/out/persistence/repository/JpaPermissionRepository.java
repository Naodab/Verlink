package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaPermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaPermissionRepository extends JpaRepository<JpaPermissionEntity, String> {
    Optional<JpaPermissionEntity> findByName(String name);
    void deleteByName(String name);
    boolean existsByName(String name);
}
