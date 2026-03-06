package com.gabrieudev.regexbuilder.infrastructure.web.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gabrieudev.regexbuilder.application.dto.regex.CreateRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.ExecuteRegexResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.UpdateRegexRequest;
import com.gabrieudev.regexbuilder.application.usecase.regex.CreateRegexUseCase;
import com.gabrieudev.regexbuilder.application.usecase.regex.DeleteRegexByIdUseCase;
import com.gabrieudev.regexbuilder.application.usecase.regex.ExecuteRegexUseCase;
import com.gabrieudev.regexbuilder.application.usecase.regex.FindRegexByIdUseCase;
import com.gabrieudev.regexbuilder.application.usecase.regex.ListRegexUseCase;
import com.gabrieudev.regexbuilder.application.usecase.regex.UpdateRegexUseCase;
import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.infrastructure.security.CurrentUser;
import com.gabrieudev.regexbuilder.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/regexes")
@Tag(name = "Regex", description = "Endpoints relacionados a expressões regulares")
public class RegexController {
    private final ExecuteRegexUseCase processRegexUseCase;
    private final CreateRegexUseCase createRegexUseCase;
    private final UpdateRegexUseCase updateRegexUseCase;
    private final FindRegexByIdUseCase findRegexByIdUseCase;
    private final ListRegexUseCase listRegexUseCase;
    private final DeleteRegexByIdUseCase deleteRegexByIdUseCase;

    public RegexController(ExecuteRegexUseCase processRegexUseCase, CreateRegexUseCase createRegexUseCase,
            UpdateRegexUseCase updateRegexUseCase, FindRegexByIdUseCase findRegexByIdUseCase,
            ListRegexUseCase listRegexUseCase, DeleteRegexByIdUseCase deleteRegexByIdUseCase) {
        this.processRegexUseCase = processRegexUseCase;
        this.createRegexUseCase = createRegexUseCase;
        this.updateRegexUseCase = updateRegexUseCase;
        this.findRegexByIdUseCase = findRegexByIdUseCase;
        this.listRegexUseCase = listRegexUseCase;
        this.deleteRegexByIdUseCase = deleteRegexByIdUseCase;
    }

    @Operation(summary = "Executar expressão regular", description = "Retorna o resultado do processamento de uma expressão regular")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressão regular executada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @PostMapping("/execute")
    public ResponseEntity<ExecuteRegexResponse> processRegex(@Valid @RequestBody ExecuteRegexRequest request) {
        ExecuteRegexResponse response = processRegexUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obter expressão regular por ID", description = "Retorna uma expressão regular de acordo com o ID inserido", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressão regular retornada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Expressão regular não encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @GetMapping("/{id}")
    public ResponseEntity<RegexResponse> findRegexById(@PathVariable UUID id) {
        RegexResponse regex = findRegexByIdUseCase.execute(id);

        return ResponseEntity.status(HttpStatus.OK).body(regex);
    }

    @Operation(summary = "Listar expressões regulares", description = "Retorna uma listagem das suas expressões regulares de acordo com os filtros inseridos como parâmetros da requisição", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressões regulares listadas com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<RegexResponse>> listRegexes(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(required = false) @Parameter(description = "Padrão da regex (busca parcial, case-insensitive)") String pattern,
            @RequestParam(required = false) @Parameter(description = "Padrão da regex (busca exata, case-sensitive)") String exactPattern,
            @RequestParam(required = false) @Parameter(description = "Nome da regex") String name,
            @RequestParam(required = false) @Parameter(description = "Linguagem da regex") RegexLanguage language,
            @RequestParam(required = false) @Parameter(description = "Data de criação (início)") LocalDateTime createdAtFrom,
            @RequestParam(required = false) @Parameter(description = "Data de criação (fim)") LocalDateTime createdAtTo,
            @RequestParam(required = false, defaultValue = "0") @Parameter(description = "Número da página (0-indexada)") Integer page,
            @RequestParam(required = false, defaultValue = "10") @Parameter(description = "Tamanho da página") Integer size) {
        PaginationRequest paginationRequest = new PaginationRequest(page, size, null, true);

        PaginationResponse<RegexResponse> regexes = listRegexUseCase.execute(
                pattern,
                exactPattern,
                name,
                language,
                userPrincipal.getId(),
                createdAtFrom,
                createdAtTo,
                paginationRequest);

        return ResponseEntity.status(HttpStatus.OK).body(regexes);
    }

    @Operation(summary = "Excluir expressão regular por ID", description = "Deleta uma expressão regular de acordo com o ID inserido", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Expressão regular excluída com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "404", description = "Expressão regular não encontrada"),
            @ApiResponse(responseCode = "409", description = "Sem permissão para excluir expressão regular"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegex(@PathVariable UUID id, @CurrentUser UserPrincipal userPrincipal) {
        deleteRegexByIdUseCase.execute(id, userPrincipal.getId());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "Atualizar expressão regular", description = "Retorna a expressão regular atualizada de acordo com o corpo da requisição", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressão regular atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Expressão regular não encontrada"),
            @ApiResponse(responseCode = "409", description = "Sem permissão para atualizar expressão regular"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Corpo da requisição inválido"),
    })
    @PutMapping("/{id}")
    public ResponseEntity<RegexResponse> updateRegex(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRegexRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        RegexResponse updatedRegex = updateRegexUseCase.execute(id, userPrincipal.getId(), request);

        return ResponseEntity.status(HttpStatus.OK).body(updatedRegex);
    }

    @Operation(summary = "Criar expressão regular", description = "Cria uma expressão regular de acordo com o corpo da requisição", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressão regular excluída com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Corpo da requisição inválido"),
    })
    @PostMapping
    public ResponseEntity<RegexResponse> createRegex(@Valid @RequestBody CreateRegexRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        RegexResponse createdRegex = createRegexUseCase.execute(request, userPrincipal.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRegex);
    }

}
