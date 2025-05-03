package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.InvalidatedToken;

import java.util.Optional;

public interface InvalidatedTokenRepositoryPort {
    Optional<InvalidatedToken> findByJit(String jit);
    InvalidatedToken save(InvalidatedToken invalidatedToken);
    void deleteByJit(String jit);
    boolean existsByJit(String jit);
}
