package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;

import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionEntity;

@Mapper(componentModel = "spring")
public interface CollectionEntityMapper {
    Collection toDomain(CollectionEntity entity);

    CollectionEntity toEntity(Collection domain);
}
