package com.gabrieudev.regexbuilder.application.usecase.regex;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.UpdateRegexRequest;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.BusinessRuleException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.RegexMapper;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class UpdateRegexUseCase {
    private final RegexRepositoryPort regexRepository;
    private final RegexMapper regexMapper;
    private final UserRepositoryPort userRepositoryPort;

    public UpdateRegexUseCase(RegexRepositoryPort regexRepository, RegexMapper regexMapper,
            UserRepositoryPort userRepositoryPort) {
        this.regexRepository = regexRepository;
        this.regexMapper = regexMapper;
        this.userRepositoryPort = userRepositoryPort;
    }

    public RegexResponse execute(UUID regexId, UUID userId, UpdateRegexRequest request) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", userId.toString()));

        Regex existingRegex = regexRepository.findById(regexId)
                .orElseThrow(() -> new ResourceNotFoundException("Regex", "id", regexId.toString()));

        if (!userId.toString().equals(user.getId().toString())) {
            throw new BusinessRuleException("Vocẽ não tem permissão para realizar esta operação.");
        }

        regexMapper.updateDomainFromRequest(request, existingRegex);

        Regex updatedRegex = regexRepository.save(existingRegex)
                .orElseThrow(() -> new BadRequestException("Falha ao atualizar regex, tente novamente mais tarde."));

        return regexMapper.toResponse(updatedRegex);
    }
}
