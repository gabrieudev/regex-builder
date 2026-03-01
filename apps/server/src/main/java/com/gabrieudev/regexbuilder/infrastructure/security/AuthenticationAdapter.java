package com.gabrieudev.regexbuilder.infrastructure.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.gabrieudev.regexbuilder.application.mapper.UserMapper;
import com.gabrieudev.regexbuilder.domain.model.User;
import com.gabrieudev.regexbuilder.domain.port.AuthenticationPort;
import com.gabrieudev.regexbuilder.infrastructure.persistence.entity.UserEntity;
import com.gabrieudev.regexbuilder.infrastructure.persistence.repository.UserJpaRepository;

@Component
public class AuthenticationAdapter implements AuthenticationPort {

    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final UserJpaRepository userRepository;

    public AuthenticationAdapter(AuthenticationManager authenticationManager,
            UserJpaRepository userRepository, UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public User authenticate(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        UserEntity entity = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return userMapper.toDomain(entity);
    }
}