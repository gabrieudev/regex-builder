package com.gabrieudev.regexbuilder.application.usecase.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.BusinessRuleException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.domain.model.EmailOptions;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.EmailPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class ResendVerificationEmailUseCase {

    private final UserRepositoryPort userRepository;
    private final EmailPort emailPort;
    private static final long TOKEN_EXPIRATION_HOURS = 24;

    @Value("${app.server-base-url}")
    private String baseUrl;
    @Value("${app.client-base-url}")
    private String clientBaseUrl;

    public ResendVerificationEmailUseCase(UserRepositoryPort userRepository, EmailPort emailPort) {
        this.userRepository = userRepository;
        this.emailPort = emailPort;
    }

    @Transactional
    public void execute(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", email));

        if (user.getEmailVerified()) {
            throw new BusinessRuleException("Email já verificado.");
        }

        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS));

        User savedUser = userRepository.save(user);

        if (savedUser == null) {
            throw new BadRequestException("Erro ao salvar o token de verificação.");
        }

        emailPort.sendVerificationEmail(new EmailOptions(
                user.getEmail(),
                user.getName(),
                buildVerificationUrl(token),
                "Formio",
                "support@formio.com"));

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
