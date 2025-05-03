package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaRoleRepository extends JpaRepository<JpaRoleEntity, String> {
    Optional<JpaRoleEntity> findByName(String name);
    void deleteByName(String name);
    boolean existsByName(String name);
}
