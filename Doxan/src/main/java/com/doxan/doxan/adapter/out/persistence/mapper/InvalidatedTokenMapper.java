package com.doxan.doxan.adapter.out.persistence.mapper;

import com.doxan.doxan.adapter.out.persistence.entity.JpaInvalidatedTokenEntity;
import com.doxan.doxan.domain.model.InvalidatedToken;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InvalidatedTokenMapper {
    InvalidatedToken toDomain(JpaInvalidatedTokenEntity entity);
    JpaInvalidatedTokenEntity toEntity(InvalidatedToken domain);
}
