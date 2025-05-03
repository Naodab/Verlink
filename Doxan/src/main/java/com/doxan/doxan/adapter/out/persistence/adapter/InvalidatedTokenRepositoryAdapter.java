package com.doxan.doxan.adapter.out.persistence.adapter;

import com.doxan.doxan.adapter.out.persistence.mapper.InvalidatedTokenMapper;
import com.doxan.doxan.adapter.out.persistence.repository.JpaInvalidatedTokenRepository;
import com.doxan.doxan.domain.model.InvalidatedToken;
import com.doxan.doxan.domain.port.out.InvalidatedTokenRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class InvalidatedTokenRepositoryAdapter implements InvalidatedTokenRepositoryPort {
    private final JpaInvalidatedTokenRepository jpaInvalidatedTokenRepository;
    private final InvalidatedTokenMapper invalidatedTokenMapper;

    public InvalidatedTokenRepositoryAdapter(final JpaInvalidatedTokenRepository jpaInvalidatedTokenRepository,
                                             final InvalidatedTokenMapper invalidatedTokenMapper) {
        this.jpaInvalidatedTokenRepository = jpaInvalidatedTokenRepository;
        this.invalidatedTokenMapper = invalidatedTokenMapper;
    }

    @Override
    public Optional<InvalidatedToken> findByJit(String jit) {
        return jpaInvalidatedTokenRepository.findById(jit)
                .map(invalidatedTokenMapper::toDomain);
    }

    @Override
    public InvalidatedToken save(InvalidatedToken invalidatedToken) {
        return invalidatedTokenMapper.toDomain(jpaInvalidatedTokenRepository
                .save(invalidatedTokenMapper.toEntity(invalidatedToken)));
    }

    @Override
    public void deleteByJit(String jit) {
        jpaInvalidatedTokenRepository.deleteByJit(jit);
    }

    @Override
    public boolean existsByJit(String jit) {
        return jpaInvalidatedTokenRepository.existsByJit(jit);
    }
}
