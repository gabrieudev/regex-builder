package com.gabrieudev.regexbuilder.domain.port;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;

public interface CollectionRepositoryPort {
    Optional<Collection> save(Collection collection);

    Optional<Collection> findById(UUID id);

    boolean delete(UUID id);

    PaginationResponse<Collection> findAllWithFilters(
            String name,
            String description,
            String color,
            String icon,
            Boolean pinned,
            List<String> tags,
            UUID userId,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            PaginationRequest paginationRequest);
}
