package com.gabrieudev.regexbuilder.application.dto.collection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.gabrieudev.regexbuilder.application.dto.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionResponse {
    private UUID id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private boolean pinned;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse user;
}
