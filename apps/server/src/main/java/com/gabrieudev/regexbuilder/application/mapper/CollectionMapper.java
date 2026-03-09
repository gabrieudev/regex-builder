package com.gabrieudev.regexbuilder.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.collection.CreateCollectionRequest;
import com.gabrieudev.regexbuilder.application.dto.collection.UpdateCollectionRequest;
import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionEntity;

@Mapper(componentModel = "spring")
public interface CollectionMapper {
    CollectionResponse toResponse(Collection collection);

    Collection toDomain(CollectionEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pinned", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    Collection toDomain(CreateCollectionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pinned", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateDomainFromRequest(UpdateCollectionRequest request, @MappingTarget Collection domain);
}
