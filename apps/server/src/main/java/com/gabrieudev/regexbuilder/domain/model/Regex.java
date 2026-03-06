package com.gabrieudev.regexbuilder.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

public class Regex {
    private UUID id;
    private String pattern;
    private String name;
    private RegexLanguage language;
    private User createdBy;
    private String elements;
    private LocalDateTime createdAt;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public RegexLanguage getLanguage() {
        return language;
    }

    public void setLanguage(RegexLanguage language) {
        this.language = language;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public String getElements() {
        return elements;
    }

    public void setElements(String elements) {
        this.elements = elements;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Regex(UUID id, String pattern, String name, RegexLanguage language, User createdBy, String elements,
            LocalDateTime createdAt) {
        this.id = id;
        this.pattern = pattern;
        this.name = name;
        this.language = language;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.elements = elements;
    }

    public Regex() {
    }

}
