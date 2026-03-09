package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionEntity;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.CollectionEntityMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.PaginationMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.repository.CollectionJpaRepository;

@Component
public class CollectionRepositoryAdapter implements CollectionRepositoryPort {
    private final CollectionJpaRepository collectionJpaRepository;
    private final CollectionEntityMapper collectionEntityMapper;
    private final PaginationMapper paginationMapper;

    public CollectionRepositoryAdapter(CollectionJpaRepository collectionJpaRepository,
            CollectionEntityMapper collectionEntityMapper, PaginationMapper paginationMapper) {
        this.collectionJpaRepository = collectionJpaRepository;
        this.collectionEntityMapper = collectionEntityMapper;
        this.paginationMapper = paginationMapper;
    }

    @Override
    public boolean delete(UUID id) {
        try {
            collectionJpaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public PaginationResponse<Collection> findAllWithFilters(String name, String description, String color, String icon,
            Boolean pinned, List<String> tags, UUID userId, LocalDateTime createdAtFrom, LocalDateTime createdAtTo,
            PaginationRequest paginationRequest) {
        Pageable pageable = null;

        if (paginationRequest.getPage() == null || paginationRequest.getSize() == null) {
            pageable = Pageable.unpaged();
        } else {
            pageable = paginationMapper.toPageable(paginationRequest);
        }

        Page<CollectionEntity> page = collectionJpaRepository.findAllWithFilters(name, description, color, icon, pinned,
                tags, userId, createdAtFrom, createdAtTo, pageable);

        return paginationMapper.toPageResponse(page.map(collectionEntityMapper::toDomain));
    }

    @Override
    public Optional<Collection> findById(UUID id) {
        return collectionJpaRepository.findById(id).map(collectionEntityMapper::toDomain);
    }

    @Override
    public Optional<Collection> save(Collection collection) {
        try {
            CollectionEntity entity = collectionEntityMapper.toEntity(collection);
            entity = collectionJpaRepository.save(entity);
            return Optional.of(collectionEntityMapper.toDomain(entity));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

}
