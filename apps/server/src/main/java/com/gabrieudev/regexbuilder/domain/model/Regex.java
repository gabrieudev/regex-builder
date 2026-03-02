package com.gabrieudev.regexbuilder.domain.model;

import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

public class Regex {
    private UUID id;
    private String pattern;
    private String description;
    private RegexLanguage language;
    private User user;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RegexLanguage getLanguage() {
        return language;
    }

    public void setLanguage(RegexLanguage language) {
        this.language = language;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Regex(UUID id, String pattern, String description, RegexLanguage language, User user) {
        this.id = id;
        this.pattern = pattern;
        this.description = description;
        this.language = language;
        this.user = user;
    }

    public Regex() {
    }

}
