package com.doxan.doxan.domain.port.out;

import com.doxan.doxan.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryPort {
    Optional<User> findById(String id);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    User save(User user);
    List<User> findAll();
    void deleteById(String id);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
