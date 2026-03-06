package com.gabrieudev.regexbuilder.application.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gabrieudev.regexbuilder.application.dto.regex.CreateRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexElement;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.UpdateRegexRequest;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.RegexEntity;

@Mapper(componentModel = "spring")
public interface RegexMapper {

    ObjectMapper MAPPER = new ObjectMapper();

    RegexResponse toResponse(Regex regex);

    Regex toDomain(RegexEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "elements", expression = "java(elementsToJson(request.getElements()))")
    Regex toDomain(CreateRegexRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "elements", expression = "java(elementsToJson(request.getElements()))")
    void updateDomainFromRequest(UpdateRegexRequest request, @MappingTarget Regex domain);

    default String elementsToJson(List<RegexElement> elements) {
        try {
            return elements == null ? null : MAPPER.writeValueAsString(elements);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}