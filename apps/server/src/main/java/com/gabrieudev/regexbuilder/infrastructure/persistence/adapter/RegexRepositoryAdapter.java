package com.gabrieudev.regexbuilder.infrastructure.persistence.adapter;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.RegexEntity;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.PaginationMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.RegexEntityMapper;
import com.gabrieudev.regexbuilder.infrastructure.persistence.repository.RegexJpaRepository;

@Component
public class RegexRepositoryAdapter implements RegexRepositoryPort {
    private final RegexJpaRepository regexJpaRepository;
    private final RegexEntityMapper regexEntityMapper;
    private final PaginationMapper paginationMapper;

    public RegexRepositoryAdapter(RegexJpaRepository regexJpaRepository, RegexEntityMapper regexEntityMapper,
            PaginationMapper paginationMapper) {
        this.regexJpaRepository = regexJpaRepository;
        this.regexEntityMapper = regexEntityMapper;
        this.paginationMapper = paginationMapper;
    }

    @Override
    public boolean delete(UUID id) {
        try {
            regexJpaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public PaginationResponse<Regex> findAllWithFilters(
            String pattern,
            String exactPattern,
            String name,
            RegexLanguage language,
            UUID createdById,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            PaginationRequest paginationRequest) {
        Pageable pageable = null;

        if (paginationRequest.getPage() == null || paginationRequest.getSize() == null) {
            pageable = Pageable.unpaged();
        } else {
            pageable = paginationMapper.toPageable(paginationRequest);
        }

        Page<RegexEntity> page = regexJpaRepository.findAllWithFilters(
                pattern,
                exactPattern,
                name,
                language,
                createdById,
                createdAtFrom,
                createdAtTo,
                pageable);

        return paginationMapper.toPageResponse(page.map(regexEntityMapper::toDomain));
    }

    @Override
    public Optional<Regex> findById(UUID id) {
        return regexJpaRepository.findById(id).map(regexEntityMapper::toDomain);
    }

    @Override
    public Optional<Regex> save(Regex regex) {
        try {
            RegexEntity entity = regexEntityMapper.toEntity(regex);
            entity = regexJpaRepository.save(entity);
            return Optional.of(regexEntityMapper.toDomain(entity));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

}
