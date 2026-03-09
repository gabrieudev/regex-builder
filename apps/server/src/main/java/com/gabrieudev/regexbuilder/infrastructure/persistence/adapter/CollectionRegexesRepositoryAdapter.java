package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.port.CollectionRegexesRepositoryPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionRegexesEntity;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.CollectionRegexesEntityMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.PaginationMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.repository.CollectionRegexesJpaRepository;

@Component
public class CollectionRegexesRepositoryAdapter implements CollectionRegexesRepositoryPort {
    private final CollectionRegexesJpaRepository collectionRegexesJpaRepository;
    private final CollectionRegexesEntityMapper collectionRegexesEntityMapper;
    private final PaginationMapper paginationMapper;

    public CollectionRegexesRepositoryAdapter(CollectionRegexesJpaRepository collectionRegexesJpaRepository,
            CollectionRegexesEntityMapper collectionRegexesEntityMapper, PaginationMapper paginationMapper) {
        this.collectionRegexesJpaRepository = collectionRegexesJpaRepository;
        this.collectionRegexesEntityMapper = collectionRegexesEntityMapper;
        this.paginationMapper = paginationMapper;
    }

    @Override
    public boolean delete(UUID id) {
        try {
            collectionRegexesJpaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public PaginationResponse<CollectionRegexes> findAllWithFilters(UUID collectionId, UUID regexId,
            String regexName, String regexPattern, LocalDateTime addedAtFrom, LocalDateTime addedAtTo,
            PaginationRequest paginationRequest) {
        Pageable pageable = null;

        if (paginationRequest.getPage() == null || paginationRequest.getSize() == null) {
            pageable = Pageable.unpaged();
        } else {
            pageable = paginationMapper.toPageable(paginationRequest);
        }

        Page<CollectionRegexesEntity> page = collectionRegexesJpaRepository.findAllWithFilters(collectionId,
                regexId, regexName, regexPattern, addedAtFrom, addedAtTo, pageable);

        return paginationMapper.toPageResponse(page.map(collectionRegexesEntityMapper::toDomain));
    }

    @Override
    public Optional<CollectionRegexes> findById(UUID id) {
        return collectionRegexesJpaRepository.findById(id).map(collectionRegexesEntityMapper::toDomain);
    }

    @Override
    public List<CollectionRegexes> saveAll(List<CollectionRegexes> collectionRegexesList) {
        try {
            List<CollectionRegexesEntity> entities = collectionRegexesList.stream()
                    .map(collectionRegexesEntityMapper::toEntity)
                    .toList();
            entities = collectionRegexesJpaRepository.saveAll(entities);
            return entities.stream()
                    .map(collectionRegexesEntityMapper::toDomain)
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }

}
