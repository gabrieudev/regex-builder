package com.gabrieudev.regexbuilder.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.gabrieudev.regexbuilder.application.dto.regex.CreateRegexRequest;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.UpdateRegexRequest;
import com.gabrieudev.regexbuilder.domain.model.Regex;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.RegexEntity;

@Mapper(componentModel = "spring")
public interface RegexMapper {
    RegexResponse toResponse(Regex regex);

    Regex toDomain(RegexEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Regex toDomain(CreateRegexRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateDomainFromRequest(UpdateRegexRequest request, @MappingTarget Regex domain);
}
