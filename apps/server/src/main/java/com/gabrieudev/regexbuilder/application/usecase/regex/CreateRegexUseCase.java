package com.gabrieudev.regexbuilder.application.usecase.regex;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.CreateRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.mapper.RegexMapper;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;

@Service
public class CreateRegexUseCase {
    private final RegexRepositoryPort regexRepository;
    private final RegexMapper regexMapper;

    public CreateRegexUseCase(RegexRepositoryPort regexRepository, RegexMapper regexMapper) {
        this.regexRepository = regexRepository;
        this.regexMapper = regexMapper;
    }

    public RegexResponse execute(CreateRegexRequest request) {
        Regex regex = regexMapper.toDomain(request);

        regexRepository.save(regex)
                .orElseThrow(() -> new BadRequestException("Falha ao criar regex, tente novamente mais tarde."));

        return regexMapper.toResponse(regex);
    }
}
