package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;

import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionRegexesEntity;

@Mapper(componentModel = "spring")
public interface CollectionRegexesEntityMapper {
    CollectionRegexes toDomain(CollectionRegexesEntity entity);

    CollectionRegexesEntity toEntity(CollectionRegexes domain);
}
