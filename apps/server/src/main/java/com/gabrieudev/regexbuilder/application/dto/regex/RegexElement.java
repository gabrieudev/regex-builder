package com.gabrieudev.regexbuilder.application.dto.regex;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegexElement {
    private String id;
    private String type;
    private String category;
    private String label;
    private String value;
    private String color;
    private String description;
    private String input;
    private Boolean configurable;
    private String placeholder;
}
