package com.gabrieudev.regexbuilder.application.usecase.user;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class GetCurrentUserUseCase {

    private final UserRepositoryPort userRepository;

    public GetCurrentUserUseCase(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}