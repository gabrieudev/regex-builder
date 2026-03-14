package com.gabrieudev.regexbuilder.domain.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class Collection {
    private UUID id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private boolean pinned;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User user;
    private List<Regex> regexes;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Collection(UUID id, String name, String description, String color, String icon, boolean pinned,
            List<String> tags, LocalDateTime createdAt, LocalDateTime updatedAt, User user, List<Regex> regexes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.icon = icon;
        this.pinned = pinned;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.regexes = regexes;
    }

    public Collection() {
    }

    public List<Regex> getRegexes() {
        return regexes;
    }

    public void setRegexes(List<Regex> regexes) {
        this.regexes = regexes;
    }

}
