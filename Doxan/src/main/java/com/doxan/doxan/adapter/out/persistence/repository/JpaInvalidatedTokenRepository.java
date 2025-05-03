package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaInvalidatedTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaInvalidatedTokenRepository extends JpaRepository<JpaInvalidatedTokenEntity, String> {
    Optional<JpaInvalidatedTokenEntity> findByJit(String jit);
    void deleteByJit(String jit);
    boolean existsByJit(String jit);
}
