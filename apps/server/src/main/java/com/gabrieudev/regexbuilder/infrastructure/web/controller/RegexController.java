package com.gabrieudev.regexbuilder.infrastructure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.usecase.regex.ProcessRegexUseCase;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/regexes")
@Tag(name = "Regex", description = "Endpoints relacionados a expressões regulares")
@SecurityRequirement(name = "bearerAuth")
public class RegexController {
    private final ProcessRegexUseCase processRegexUseCase;

    public RegexController(ProcessRegexUseCase processRegexUseCase) {
        this.processRegexUseCase = processRegexUseCase;
    }

    @Operation(summary = "Processar expressão regular")
    @PostMapping
    public ResponseEntity<RegexResponse> processRegex(@Valid @RequestBody RegexRequest request) {
        RegexResponse response = processRegexUseCase.execute(request);
        return ResponseEntity.ok(response);
    }
}
