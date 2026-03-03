package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;

import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.RegexEntity;

@Mapper(componentModel = "spring")
public interface RegexEntityMapper {
    Regex toDomain(RegexEntity entity);

    RegexEntity toEntity(Regex domain);
}
