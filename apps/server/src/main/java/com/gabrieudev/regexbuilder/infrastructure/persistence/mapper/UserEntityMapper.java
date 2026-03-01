package com.gabrieudev.regexbuilder.infrastructure.persistence.mapper;

import org.mapstruct.Mapper;

import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {
    UserEntity toEntity(User user);

    User toDomain(UserEntity entity);
}