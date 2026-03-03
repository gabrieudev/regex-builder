package com.gabrieudev.regexbuilder.application.dto.regex;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExecuteRegexResponse {
    private boolean success;
    private List<String> matches;
    private String error;
    private long executionTimeMs;
    private Integer matchCount;
    private List<Map<String, Integer>> matchRanges;
    private List<List<String>> groups;
    private Map<String, List<String>> namedGroups;
    private Boolean isFullMatch;
    private List<String> warnings;
    private Map<String, Object> meta;
}
