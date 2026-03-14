package com.gabrieudev.regexbuilder.application.usecase.collection;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.collection.CreateCollectionRequest;
import com.gabrieudev.regexbuilder.application.exception.BadRequestException;
import com.gabrieudev.regexbuilder.application.exception.ResourceNotFoundException;
import com.gabrieudev.regexbuilder.application.mapper.CollectionMapper;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.CollectionRepositoryPort;
import com.gabrieudev.regexbuilder.domain.port.UserRepositoryPort;

@Service
public class CreateCollectionUseCase {
    private final CollectionRepositoryPort collectionRepositoryPort;
    private final CollectionMapper collectionMapper;
    private final UserRepositoryPort userRepositoryPort;

    public CreateCollectionUseCase(CollectionRepositoryPort collectionRepositoryPort,
            CollectionMapper collectionMapper, UserRepositoryPort userRepositoryPort) {
        this.collectionRepositoryPort = collectionRepositoryPort;
        this.collectionMapper = collectionMapper;
        this.userRepositoryPort = userRepositoryPort;
    }

    public CollectionResponse execute(CreateCollectionRequest request, UUID userId) {
        Collection collection = collectionMapper.toDomain(request);
        Optional<User> userOpt = userRepositoryPort.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuário", "id", userId.toString());
        }

        collection.setUser(userOpt.get());

        Optional<Collection> savedCollection = collectionRepositoryPort.save(collection);

        if (savedCollection.isEmpty()) {
            throw new BadRequestException("Falha ao criar coleção, tente novamente mais tarde.");
        }

        return collectionMapper.toResponse(savedCollection.get());
    }
}
