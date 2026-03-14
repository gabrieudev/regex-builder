package com.gabrieudev.regexbuilder.application.usecase.collection_regexes;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.CollectionRegexesRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;

@Service
public class DeleteCollectionRegexesUseCase {
    private final CollectionRegexesRepositoryPort collectionRegexesRepositoryPort;
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final RegexRepositoryPort regexRepositoryPort;

    public DeleteCollectionRegexesUseCase(CollectionRegexesRepositoryPort collectionRegexesRepositoryPort,
            CollectionRepositoryPort collectionRepositoryPort, RegexRepositoryPort regexRepositoryPort) {
        this.collectionRegexesRepositoryPort = collectionRegexesRepositoryPort;
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.regexRepositoryPort = regexRepositoryPort;
    }

    @Transactional
    public void execute(UUID collectionId, UUID regexId) {
        Optional<Collection> collectionOptional = collectionRepositoryPort.findById(collectionId);
        Optional<Regex> regexOptional = regexRepositoryPort.findById(regexId);

        if (collectionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Coleção", "id", collectionId.toString());
        }

        if (regexOptional.isEmpty()) {
            throw new ResourceNotFoundException("Regex", "id", regexId.toString());
        }

        CollectionRegexes collectionRegexes = collectionRegexesRepositoryPort
                .findByCollectionIdAndRegexId(collectionId, regexId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Relação entre coleção e regex", "collectionId e regexId",
                        collectionId.toString() + " e " + regexId.toString()));

        if (!collectionRegexesRepositoryPort.delete(collectionRegexes.getId())) {
            throw new BadRequestException(
                    "Erro ao deletar a relação entre coleção e regex, tente novamente mais tarde.");
        }
    }
}
