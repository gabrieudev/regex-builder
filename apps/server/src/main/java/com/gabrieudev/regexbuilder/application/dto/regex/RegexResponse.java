package com.gabrieudev.regexbuilder.application.dto.regex;

import java.time.LocalDateTime;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;
import com.gabrieudev.regexbuilder.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegexResponse {
    private UUID id;
    private String pattern;
    private String name;
    private RegexLanguage language;
    private User createdBy;
    private String elements;
    private LocalDateTime createdAt;
}
