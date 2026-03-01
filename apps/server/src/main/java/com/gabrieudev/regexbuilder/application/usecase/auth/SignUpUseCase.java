package com.gabrieudev.regexbuilder.application.usecase.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import com.gabrieudev.regexbuilder.application.dto.auth.SignUpRequest;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.domain.enums.AuthProvider;
import com.gabrieudev.regexbuilder.domain.model.EmailOptions;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.EmailPort;
import com.gabrieudev.regexbuilder.domain.port.PasswordEncoderPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class SignUpUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final EmailPort emailPort;
    private static final long TOKEN_EXPIRATION_HOURS = 24;

    @Value("${app.server-base-url}")
    private String baseUrl;
    @Value("${app.client-base-url}")
    private String clientBaseUrl;

    public SignUpUseCase(UserRepositoryPort userRepository, PasswordEncoderPort passwordEncoder, EmailPort emailPort) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailPort = emailPort;
    }

    @Transactional
    public User execute(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email já está em uso.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.local);

        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS));

        User savedUser = userRepository.save(user);

        if (savedUser == null) {
            throw new BadRequestException("Erro ao criar usuário.");
        }

        emailPort.sendVerificationEmail(new EmailOptions(
                user.getEmail(),
                user.getName(),
                buildVerificationUrl(token),
                "Formio",
                "support@formio.com"));

        return savedUser;
    }

    private String buildVerificationUrl(String token) {
        return UriComponentsBuilder
                .fromUriString(baseUrl + "/auth/verify-email")
                .queryParam("token", token)
                .queryParam("callbackUrl", clientBaseUrl + "/auth/login")
                .build()
                .toUriString();
    }
}