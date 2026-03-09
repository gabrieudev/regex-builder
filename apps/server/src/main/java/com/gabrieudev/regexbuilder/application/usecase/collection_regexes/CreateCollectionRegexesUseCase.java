package com.gabrieudev.regexbuilder.application.usecase.collection_regexes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.collection_regexes.CollectionRegexesResponse;
import com.gabrieudev.regexbuilder.application.dto.collection_regexes.CreateCollectionRegexesRequest;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.CollectionRegexesMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.domain.port.CollectionRegexesRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.RegexRepositoryPort;

@Service
public class CreateCollectionRegexesUseCase {
    private final CollectionRegexesRepositoryPort collectionRegexesRepositoryPort;
    private final CollectionRegexesMapper collectionRegexesMapper;
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final RegexRepositoryPort regexRepositoryPort;

    public CreateCollectionRegexesUseCase(CollectionRegexesRepositoryPort collectionRegexesRepositoryPort,
            CollectionRegexesMapper collectionRegexesMapper, CollectionRepositoryPort collectionRepositoryPort,
            RegexRepositoryPort regexRepositoryPort) {
        this.collectionRegexesRepositoryPort = collectionRegexesRepositoryPort;
        this.collectionRegexesMapper = collectionRegexesMapper;
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.regexRepositoryPort = regexRepositoryPort;
    }

    public List<CollectionRegexesResponse> execute(UUID collectionId, CreateCollectionRegexesRequest request) {
        Optional<Collection> collectionOptional = collectionRepositoryPort.findById(collectionId);
        List<Optional<Regex>> regexOptionals = request.getRegexIds().stream()
                .map(regexRepositoryPort::findById)
                .toList();

        if (collectionOptional.isEmpty()) {
            throw new ResourceNotFoundException("Coleção", "id", collectionId.toString());
        }

        regexOptionals.forEach(regexOptional -> {
            if (regexOptional.isEmpty()) {
                throw new ResourceNotFoundException("Regex", "id", request.getRegexIds().toString());
            }
        });

        List<CollectionRegexes> collectionRegexesList = regexOptionals.stream()
                .map(regexOptional -> {
                    CollectionRegexes collectionRegexes = new CollectionRegexes();
                    collectionRegexes.setCollection(collectionOptional.get());
                    collectionRegexes.setRegex(regexOptional.get());
                    collectionRegexes.setAddedAt(LocalDateTime.now());
                    return collectionRegexes;
                })
                .toList();

        List<CollectionRegexes> savedCollectionRegexes = collectionRegexesRepositoryPort.saveAll(collectionRegexesList);

        return savedCollectionRegexes.stream()
                .map(collectionRegexesMapper::toResponse)
                .toList();
    }
}
