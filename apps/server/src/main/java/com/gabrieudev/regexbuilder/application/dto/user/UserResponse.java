package com.gabrieudev.regexbuilder.application.dto.user;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String imageUrl;
    private Boolean emailVerified;
    private String provider;
    private String providerId;
}