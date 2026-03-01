package com.gabrieudev.regexbuilder.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gabrieudev.regexbuilder.application.dto.user.UserResponse;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "emailVerificationToken", ignore = true)
    @Mapping(target = "emailVerificationTokenExpiry", ignore = true)
    User toDomain(UserResponse userResponse);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "emailVerificationToken", ignore = true)
    @Mapping(target = "emailVerificationTokenExpiry", ignore = true)
    User toDomain(UserEntity userEntity);
}
