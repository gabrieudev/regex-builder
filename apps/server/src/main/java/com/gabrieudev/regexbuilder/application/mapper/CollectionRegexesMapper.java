package com.gabrieudev.regexbuilder.application.mapper;

import org.mapstruct.Mapper;

import com.gabrieudev.regexbuilder.application.dto.collection_regexes.CollectionRegexesResponse;
import com.gabrieudev.regexbuilder.domain.model.CollectionRegexes;

@Mapper(componentModel = "spring")
public interface CollectionRegexesMapper {
    CollectionRegexesResponse toResponse(CollectionRegexes collectionRegexes);
}
