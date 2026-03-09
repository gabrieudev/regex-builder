package com.gabrieudev.regexbuilder.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class CollectionRegexes {
    private UUID id;
    private Collection collection;
    private Regex regex;
    private LocalDateTime addedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Collection getCollection() {
        return collection;
    }

    public void setCollection(Collection collection) {
        this.collection = collection;
    }

    public Regex getRegex() {
        return regex;
    }

    public void setRegex(Regex regex) {
        this.regex = regex;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public CollectionRegexes(UUID id, Collection collection, Regex regex, LocalDateTime addedAt) {
        this.id = id;
        this.collection = collection;
        this.regex = regex;
        this.addedAt = addedAt;
    }

    public CollectionRegexes() {
    }

}
