package com.gabrieudev.regexbuilder.application.usecase.regex;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.BusinessRuleException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class DeleteRegexByIdUseCase {
    private final RegexRepositoryPort regexRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;

    public DeleteRegexByIdUseCase(RegexRepositoryPort regexRepositoryPort, UserRepositoryPort userRepositoryPort) {
        this.regexRepositoryPort = regexRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
    }

    public void execute(UUID regexId, UUID userId) {
        User user = userRepositoryPort.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "id", userId.toString()));

        if (!user.getId().toString().equals(userId.toString())) {
            throw new BusinessRuleException("Você não tem permissão para realizar esta operação.");
        }

        if (!regexRepositoryPort.delete(regexId)) {
            throw new BadRequestException("Não foi possível excluir regex, tente novamente mais tarde.");
        }
    }
}
