package com.gabrieudev.regexbuilder.domain.port;

import java.util.Optional;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.model.User;

public interface UserRepositoryPort {
    Optional<User> findByEmail(String email);

    Optional<User> findById(UUID id);

    User save(User user);

    boolean existsByEmail(String email);

    Optional<User> findByEmailVerificationToken(String token);
}