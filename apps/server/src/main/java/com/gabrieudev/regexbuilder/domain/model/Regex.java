package com.gabrieudev.regexbuilder.domain.model;

import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

public class Regex {
    private UUID id;
    private String pattern;
    private String description;
    private RegexLanguage language;
    private User user;
}
