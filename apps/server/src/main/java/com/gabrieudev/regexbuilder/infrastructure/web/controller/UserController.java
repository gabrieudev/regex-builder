package com.gabrieudev.regexbuilder.infrastructure.web.controller;

import com.gabrieudev.regexbuilder.application.dto.user.UserResponse;
import com.gabrieudev.regexbuilder.application.mapper.UserMapper;
import com.gabrieudev.regexbuilder.application.usecase.user.GetCurrentUserUseCase;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.infrastructure.security.CurrentUser;
import com.gabrieudev.regexbuilder.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Usuário", description = "Endpoints relacionados ao usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final UserMapper userMapper;

    public UserController(GetCurrentUserUseCase getCurrentUserUseCase, UserMapper userMapper) {
        this.getCurrentUserUseCase = getCurrentUserUseCase;
        this.userMapper = userMapper;
    }

    @Operation(summary = "Buscar usuário autenticado", description = "Retorna os dados do usuário atualmente autenticado no sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "403", description = "Sem permissão de acesso")
    })
    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserResponse getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        User user = getCurrentUserUseCase.execute(userPrincipal.getId());
        return userMapper.toResponse(user);
    }
}