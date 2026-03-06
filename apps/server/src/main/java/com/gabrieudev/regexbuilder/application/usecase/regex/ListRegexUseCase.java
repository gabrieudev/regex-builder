package com.gabrieudev.regexbuilder.application.usecase.regex;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.mapper.RegexMapper;
import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.domain.model.PaginationRequest;
import com.gabrieudev.regexbuilder.domain.model.PaginationResponse;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.mapper.PaginationMapper;

@Service
public class ListRegexUseCase {
    private final RegexRepositoryPort regexRepository;
    private final PaginationMapper paginationMapper;
    private final RegexMapper regexMapper;

    public ListRegexUseCase(RegexRepositoryPort regexRepository, PaginationMapper paginationMapper,
            RegexMapper regexMapper) {
        this.regexRepository = regexRepository;
        this.paginationMapper = paginationMapper;
        this.regexMapper = regexMapper;
    }

    public PaginationResponse<RegexResponse> execute(
            String pattern,
            String exactPattern,
            String name,
            RegexLanguage language,
            UUID createdById,
            LocalDateTime createdAtFrom,
            LocalDateTime createdAtTo,
            PaginationRequest paginationRequest) {
        PaginationResponse<Regex> result = regexRepository
                .findAllWithFilters(
                        pattern,
                        exactPattern,
                        name,
                        language,
                        createdById,
                        createdAtFrom,
                        createdAtTo,
                        paginationRequest);

        return paginationMapper.map(result, regexMapper::toResponse);
    }
}
