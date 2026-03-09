package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.CollectionMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;

@Service
public class FindCollectionByIdUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final CollectionMapper collectionMapper;

    public FindCollectionByIdUseCase(CollectionRepositoryPort collectionRepositoryPort,
            CollectionMapper collectionMapper) {
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.collectionMapper = collectionMapper;
    }

    public CollectionResponse execute(UUID id) {
        Optional<Collection> collection = collectionRepositoryPort.findById(id);

        if (collection.isEmpty()) {
            throw new ResourceNotFoundException("Coleção", "id", id);
        }

        return collectionMapper.toResponse(collection.get());
    }
}
