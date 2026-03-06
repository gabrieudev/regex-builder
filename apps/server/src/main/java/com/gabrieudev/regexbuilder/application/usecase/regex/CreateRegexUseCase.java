package com.gabrieudev.regexbuilder.application.usecase.regex;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.CreateRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.mapper.RegexMapper;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class CreateRegexUseCase {
    private final RegexRepositoryPort regexRepository;
    private final RegexMapper regexMapper;
    private final UserRepositoryPort userRepository;

    public CreateRegexUseCase(RegexRepositoryPort regexRepository, RegexMapper regexMapper,
            UserRepositoryPort userRepository) {
        this.regexRepository = regexRepository;
        this.regexMapper = regexMapper;
        this.userRepository = userRepository;
    }

    public RegexResponse execute(CreateRegexRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Usuário não encontrado"));

        Regex regex = regexMapper.toDomain(request);

        regex.setCreatedAt(LocalDateTime.now());
        regex.setCreatedBy(user);

        regexRepository.save(regex)
                .orElseThrow(() -> new BadRequestException("Falha ao criar regex, tente novamente mais tarde."));

        return regexMapper.toResponse(regex);
    }
}
