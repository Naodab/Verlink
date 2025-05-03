package com.doxan.doxan.adapter.out.persistence.repository;

import com.doxan.doxan.adapter.out.persistence.entity.JpaMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaMediaRepository extends JpaRepository<JpaMediaEntity, String> {
}
