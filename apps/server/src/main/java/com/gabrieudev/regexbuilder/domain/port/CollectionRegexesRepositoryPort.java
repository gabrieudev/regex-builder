package com.gabrieudev.regexbuilder.domain.port;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;

public interface CollectionRegexesRepositoryPort {
    List<CollectionRegexes> saveAll(List<CollectionRegexes> collectionRegexesList);

    Optional<CollectionRegexes> findById(UUID id);

    boolean delete(UUID id);

    PaginationResponse<CollectionRegexes> findAllWithFilters(
            UUID collectionId,
            UUID regexId,
            String regexName,
            String regexPattern,
            LocalDateTime addedAtFrom,
            LocalDateTime addedAtTo,
            PaginationRequest paginationRequest);
}
