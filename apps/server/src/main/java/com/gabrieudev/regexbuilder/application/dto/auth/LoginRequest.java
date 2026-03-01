package com.gabrieudev.regexbuilder.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @NotNull(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @NotNull(message = "Senha é obrigatória")
    private String password;
}