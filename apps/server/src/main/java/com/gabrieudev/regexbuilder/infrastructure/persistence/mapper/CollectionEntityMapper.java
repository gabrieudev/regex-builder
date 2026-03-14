package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gabrieudev.regexbuilder.domain.model.Collection;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionEntity;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.CollectionRegexesEntity;

@Mapper(componentModel = "spring")
public interface CollectionEntityMapper {

    Collection toDomain(CollectionEntity entity);

    CollectionEntity toEntity(Collection domain);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "regexes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDomain(Collection domain, @MappingTarget CollectionEntity entity);

    @Mapping(target = "id", source = "regex.id")
    @Mapping(target = "pattern", source = "regex.pattern")
    @Mapping(target = "name", source = "regex.name")
    @Mapping(target = "language", source = "regex.language")
    @Mapping(target = "createdBy", source = "regex.createdBy")
    @Mapping(target = "elements", source = "regex.elements")
    @Mapping(target = "createdAt", source = "regex.createdAt")
    Regex map(CollectionRegexesEntity entity);

    @Mapping(target = "collection", ignore = true)
    @Mapping(target = "regex", ignore = true)
    @Mapping(target = "addedAt", ignore = true)
    CollectionRegexesEntity map(Regex regex);
}