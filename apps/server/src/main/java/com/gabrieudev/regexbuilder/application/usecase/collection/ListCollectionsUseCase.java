package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.mapper.CollectionMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.PaginationMapper;

@Service
public class ListCollectionsUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final CollectionMapper collectionMapper;
    private final PaginationMapper paginationMapper;

    public ListCollectionsUseCase(CollectionRepositoryPort collectionRepositoryPort,
            CollectionMapper collectionMapper, PaginationMapper paginationMapper) {
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.collectionMapper = collectionMapper;
        this.paginationMapper = paginationMapper;
    }

    @Transactional(readOnly = true)
    public PaginationResponse<CollectionResponse> execute(
            String name,
            String description,
            String color,
            String icon,
            Boolean pinned,
            List<String> tags,
            UUID userId,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            PaginationRequest paginationRequest) {
        PaginationResponse<Collection> collections = collectionRepositoryPort.findAllWithFilters(
                name,
                description,
                color,
                icon,
                pinned,
                tags,
                userId,
                createdAtFrom,
                createdAtTo,
                paginationRequest);

        return paginationMapper.map(collections, collectionMapper::toResponse);
    }
}
