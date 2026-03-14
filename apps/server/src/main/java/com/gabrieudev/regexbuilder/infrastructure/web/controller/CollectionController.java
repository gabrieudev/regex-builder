package com.gabrieudev.regexbuilder.infrastructure.web.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.collection.CreateCollectionRequest;
import com.gabrieudev.regexbuilder.application.dto.collection.UpdateCollectionRequest;
import com.gabrieudev.regexbuilder.application.dto.collection_regexes.CollectionRegexesResponse;
import com.gabrieudev.regexbuilder.application.dto.collection_regexes.CreateCollectionRegexesRequest;
import com.gabrieudev.regexbuilder.application.usecase.collection.CreateCollectionUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection.DeleteCollectionByIdUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection.FindCollectionByIdUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection.ListCollectionsUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection.UpdateCollectionUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection_regexes.CreateCollectionRegexesUseCase;
import com.gabrieudev.regexbuilder.application.usecase.collection_regexes.DeleteCollectionRegexesUseCase;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.infrastructure.security.CurrentUser;
import com.gabrieudev.regexbuilder.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/collections")
@Tag(name = "Coleção", description = "Endpoints relacionados a coleções")
public class CollectionController {
    private final CreateCollectionUseCase createCollectionUseCase;
    private final UpdateCollectionUseCase updateCollectionUseCase;
    private final FindCollectionByIdUseCase findCollectionByIdUseCase;
    private final ListCollectionsUseCase listCollectionsUseCase;
    private final DeleteCollectionByIdUseCase deleteCollectionByIdUseCase;
    private final CreateCollectionRegexesUseCase createCollectionRegexesUseCase1;
    private final DeleteCollectionRegexesUseCase deleteCollectionRegexesUseCase;

    public CollectionController(CreateCollectionUseCase createCollectionUseCase,
            UpdateCollectionUseCase updateCollectionUseCase, FindCollectionByIdUseCase findCollectionByIdUseCase,
            ListCollectionsUseCase listCollectionsUseCase, DeleteCollectionByIdUseCase deleteCollectionByIdUseCase,
            CreateCollectionRegexesUseCase createCollectionRegexesUseCase1,
            DeleteCollectionRegexesUseCase deleteCollectionRegexesUseCase) {
        this.createCollectionUseCase = createCollectionUseCase;
        this.updateCollectionUseCase = updateCollectionUseCase;
        this.findCollectionByIdUseCase = findCollectionByIdUseCase;
        this.listCollectionsUseCase = listCollectionsUseCase;
        this.deleteCollectionByIdUseCase = deleteCollectionByIdUseCase;
        this.createCollectionRegexesUseCase1 = createCollectionRegexesUseCase1;
        this.deleteCollectionRegexesUseCase = deleteCollectionRegexesUseCase;
    }

    @Operation(summary = "Criar coleção", description = "Cria uma nova coleção com os dados fornecidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coleção criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Corpo da requisição inválido"),
    })
    @PostMapping
    public ResponseEntity<CollectionResponse> createCollection(@Valid @RequestBody CreateCollectionRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        CollectionResponse response = createCollectionUseCase.execute(request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Adicionar expressões regulares na coleção", description = "Adiciona novas expressões regulares na coleção especificada.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expressões regulares adicionadas com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Corpo da requisição inválido"),
    })
    @PostMapping("/{collectionId}/regexes")
    public ResponseEntity<List<CollectionRegexesResponse>> createCollectionRegexes(
            @Valid @RequestBody CreateCollectionRegexesRequest request, @PathVariable UUID collectionId) {
        List<CollectionRegexesResponse> response = createCollectionRegexesUseCase1.execute(collectionId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar coleções", description = "Lista as coleções do usuário autenticado, permitindo filtros, paginação e ordenação.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coleções listadas com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<CollectionResponse>> listCollections(
            @RequestParam(required = false) @Parameter(description = "Nome da coleção") String name,
            @RequestParam(required = false) @Parameter(description = "Descrição da coleção") String description,
            @RequestParam(required = false) @Parameter(description = "Cor da coleção") String color,
            @RequestParam(required = false) @Parameter(description = "Ícone da coleção") String icon,
            @RequestParam(required = false) @Parameter(description = "Coleção fixada") Boolean pinned,
            @RequestParam(required = false) @Parameter(description = "Tags da coleção") List<String> tags,
            @RequestParam(required = false) @Parameter(description = "Data de criação a partir de") LocalDateTime createdAtFrom,
            @RequestParam(required = false) @Parameter(description = "Data de criação até") LocalDateTime createdAtTo,
            @RequestParam(required = false, defaultValue = "0") @Parameter(description = "Número da página (0-indexada)") Integer page,
            @RequestParam(required = false, defaultValue = "10") @Parameter(description = "Tamanho da página") Integer size,
            @RequestParam(required = false, defaultValue = "createdAt") @Parameter(description = "Campo para ordenação") String sortBy,
            @RequestParam(required = false, defaultValue = "true") @Parameter(description = "Ordenação ascendente") Boolean ascending,
            @CurrentUser UserPrincipal userPrincipal) {
        PaginationRequest paginationRequest = new PaginationRequest(page, size, sortBy, ascending);

        PaginationResponse<CollectionResponse> response = listCollectionsUseCase.execute(
                name,
                description,
                color,
                icon,
                pinned,
                tags,
                userPrincipal.getId(),
                createdAtFrom,
                createdAtTo,
                paginationRequest);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Buscar coleção por ID", description = "Busca uma coleção pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coleção encontrada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Coleção não encontrada"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getCollection(@PathVariable UUID id) {
        CollectionResponse response = findCollectionByIdUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Atualizar coleção", description = "Atualiza uma coleção existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coleção atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Coleção não encontrada"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Corpo da requisição inválido"),
    })
    @PutMapping("/{id}")
    public ResponseEntity<CollectionResponse> updateCollection(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCollectionRequest request) {
        CollectionResponse response = updateCollectionUseCase.execute(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Deletar coleção", description = "Deleta uma coleção existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Coleção deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Coleção não encontrada"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable UUID id) {
        deleteCollectionByIdUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Deletar relação entre coleção e regex", description = "Deleta a relação entre uma coleção e uma expressão regular.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Relação entre coleção e regex deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Coleção ou regex não encontrada"),
            @ApiResponse(responseCode = "400", description = "Erro interno"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
    })
    @DeleteMapping("/{collectionId}/regexes/{regexId}")
    public ResponseEntity<Void> deleteCollectionRegexes(@PathVariable UUID collectionId, @PathVariable UUID regexId) {
        deleteCollectionRegexesUseCase.execute(collectionId, regexId);
        return ResponseEntity.noContent().build();
    }

}
