package com.gabrieudev.regexbuilder.application.dto.collection_regexes;

import java.time.LocalDateTime;
import java.util.UUID;

import com.gabrieudev.regexbuilder.application.dto.collection.CollectionResponse;
import com.gabrieudev.regexbuilder.application.dto.regex.RegexResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollectionRegexesResponse {
    private UUID id;
    private CollectionResponse collection;
    private RegexResponse regex;
    private LocalDateTime addedAt;
}
