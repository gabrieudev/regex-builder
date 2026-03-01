package com.gabrieudev.regexbuilder.application.usecase.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

import java.time.LocalDateTime;

@Service
public class VerifyEmailUseCase {

    private final UserRepositoryPort userRepository;

    public VerifyEmailUseCase(UserRepositoryPort userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void execute(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Token inválido."));

        if (user.getEmailVerified()) {
            throw new BadRequestException("Email já verificado.");
        }

        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token de verificação expirado.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);
    }
}