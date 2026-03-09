package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;

@Service
public class DeleteCollectionByIdUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;

    public DeleteCollectionByIdUseCase(CollectionRepositoryPort collectionRepositoryPort) {
        this.collectionRepositoryPort = collectionRepositoryPort;
    }

    public void execute(UUID id) {
        if (!collectionRepositoryPort.delete(id)) {
            throw new BadRequestException("Falha ao deletar coleção, tente novamente mais tarde.");
        }
    }
}
