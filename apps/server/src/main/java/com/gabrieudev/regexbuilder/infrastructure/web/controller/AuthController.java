package com.gabrieudev.regexbuilder.infrastructure.web.controller;

import java.io.IOException;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gabrieudev.regexbuilder.application.dto.auth.AuthResponse;
import com.gabrieudev.regexbuilder.application.dto.auth.LoginRequest;
import com.gabrieudev.regexbuilder.application.dto.auth.SignUpRequest;
import com.gabrieudev.regexbuilder.application.dto.auth.SignUpResponse;
import com.gabrieudev.regexbuilder.application.usecase.auth.LoginUseCase;
import com.gabrieudev.regexbuilder.application.usecase.auth.ResendVerificationEmailUseCase;
import com.gabrieudev.regexbuilder.application.usecase.auth.SignUpUseCase;
import com.gabrieudev.regexbuilder.application.usecase.auth.VerifyEmailUseCase;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.infrastructure.security.CurrentUser;
import com.gabrieudev.regexbuilder.infrastructure.security.TokenProvider;
import com.gabrieudev.regexbuilder.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints de autenticação e registro de usuários")
public class AuthController {
    @Value("${CORS_ORIGINS:http://localhost:3000,http://localhost:8080}")
    private String corsOrigins;

    private final VerifyEmailUseCase verifyEmailUseCase;
    private final SignUpUseCase signUpUseCase;
    private final LoginUseCase loginUseCase;
    private final TokenProvider tokenProvider;
    private final ResendVerificationEmailUseCase resendVerificationEmailUseCase;

    public AuthController(SignUpUseCase signUpUseCase, LoginUseCase loginUseCase, TokenProvider tokenProvider,
            VerifyEmailUseCase verifyEmailUseCase, ResendVerificationEmailUseCase resendVerificationEmailUseCase) {
        this.signUpUseCase = signUpUseCase;
        this.loginUseCase = loginUseCase;
        this.tokenProvider = tokenProvider;
        this.verifyEmailUseCase = verifyEmailUseCase;
        this.resendVerificationEmailUseCase = resendVerificationEmailUseCase;
    }

    @Operation(summary = "Autenticar usuário", description = "Realiza autenticação do usuário e retorna um token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação realizada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = loginUseCase.execute(loginRequest);
        String token = tokenProvider.createToken(user);
        return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
    }

    @Operation(summary = "Registrar novo usuário", description = "Cria um novo usuário no sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        User user = signUpUseCase.execute(signUpRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(user.getId()).toUri();

        SignUpResponse response = new SignUpResponse(
                true,
                "Usuário registrado com sucesso. Por favor, verifique seu email para ativar sua conta.");
        return ResponseEntity.created(location).body(response);
    }

    @Operation(summary = "Verificar email", description = "Verifica o email do usuário e redireciona para callbackUrl se informado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email verificado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Token inválido ou expirado")
    })
    @GetMapping("/verify-email")
    public void verifyEmail(
            @RequestParam String token,
            @RequestParam(required = false) String callbackUrl,
            HttpServletResponse response) throws IOException {

        verifyEmailUseCase.execute(token);

        if (callbackUrl != null && !callbackUrl.isBlank()) {

            try {
                URI callbackUri = new URI(callbackUrl);
                String origin = callbackUri.getScheme() + "://" + callbackUri.getHost();
                if (corsOrigins.contains(origin)) {
                    response.sendRedirect(callbackUrl);
                    return;
                }
            } catch (Exception e) {
            }
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"success\":true,\"message\":\"Email verificado com sucesso.\"}");
    }

    @Operation(summary = "Reenviar email de verificação", description = "Reenvia o email de verificação para o usuário", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email de verificação reenviado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping("/resend-verification-email")
    public ResponseEntity<Void> resendVerificationEmail(@CurrentUser UserPrincipal userPrincipal) {
        resendVerificationEmailUseCase.execute(userPrincipal.getEmail());
        return ResponseEntity.ok().build();
    }
}