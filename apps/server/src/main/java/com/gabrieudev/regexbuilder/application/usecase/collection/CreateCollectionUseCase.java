package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.collection.CreateCollectionRequest;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.mapper.CollectionMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;

@Service
public class CreateCollectionUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final CollectionMapper collectionMapper;

    public CreateCollectionUseCase(CollectionRepositoryPort collectionRepositoryPort,
            CollectionMapper collectionMapper) {
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.collectionMapper = collectionMapper;
    }

    public CollectionResponse execute(CreateCollectionRequest request) {
        Collection collection = collectionMapper.toDomain(request);

        Optional<Collection> savedCollection = collectionRepositoryPort.save(collection);

        if (savedCollection.isEmpty()) {
            throw new BadRequestException("Falha ao criar coleção, tente novamente mais tarde.");
        }

        return collectionMapper.toResponse(savedCollection.get());
    }
}
