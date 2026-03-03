package com.gabrieudev.regexbuilder.application.usecase.regex;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.RegexMapper;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;

@Service
public class FindRegexByIdUseCase {
    private final RegexRepositoryPort regexRepository;
    private final RegexMapper regexMapper;

    public FindRegexByIdUseCase(RegexRepositoryPort regexRepository, RegexMapper regexMapper) {
        this.regexRepository = regexRepository;
        this.regexMapper = regexMapper;
    }

    public RegexResponse execute(UUID id) {
        Regex regex = regexRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regex", "id", id.toString()));

        return regexMapper.toResponse(regex);
    }
}
