package com.gabrieudev.regexbuilder.application.usecase.auth;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.auth.LoginRequest;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.AuthenticationPort;

@Service
public class LoginUseCase {

    private final AuthenticationPort authenticationPort;

    public LoginUseCase(AuthenticationPort authenticationPort) {
        this.authenticationPort = authenticationPort;
    }

    public User execute(LoginRequest request) {
        return authenticationPort.authenticate(request.getEmail(), request.getPassword());
    }
}