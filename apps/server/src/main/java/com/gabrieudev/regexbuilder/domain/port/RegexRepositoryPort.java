package com.gabrieudev.regexbuilder.domain.port;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.model.Regex;

public interface RegexRepositoryPort {
    Optional<Regex> save(Regex regex);

    Optional<Regex> findById(UUID id);

    boolean delete(UUID id);

    PaginationResponse<Regex> findAllWithFilters(
            String pattern,
            String exactPattern,
            String name,
            RegexLanguage language,
            UUID createdById,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            PaginationRequest paginationRequest);
}
