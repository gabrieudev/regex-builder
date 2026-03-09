package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.collection.UpdateCollectionRequest;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.CollectionMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;

@Service
public class UpdateCollectionUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final CollectionMapper collectionMapper;

    public UpdateCollectionUseCase(CollectionRepositoryPort collectionRepositoryPort,
            CollectionMapper collectionMapper) {
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.collectionMapper = collectionMapper;
    }

    public CollectionResponse execute(UUID collectionId, UpdateCollectionRequest collectionRequest) {
        Optional<Collection> existingCollection = collectionRepositoryPort.findById(collectionId);

        if (existingCollection.isEmpty()) {
            throw new ResourceNotFoundException("Coleção", "id", collectionId);
        }

        Collection domainCollection = existingCollection.get();

        collectionMapper.updateDomainFromRequest(collectionRequest, domainCollection);

        return collectionRepositoryPort.save(domainCollection)
                .map(collectionMapper::toResponse)
                .orElseThrow(() -> new BadRequestException("Falha ao atualizar coleção, tente novamente mais tarde."));
    }
}
