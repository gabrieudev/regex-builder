package com.gabrieudev.regexbuilder.application.dto.regex;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegexRequest {
    @NotNull(message = "O campo 'pattern' é obrigatório")
    @NotBlank(message = "O campo 'pattern' não pode ser vazio")
    private String pattern;

    @NotNull(message = "O campo 'testString' é obrigatório")
    @NotBlank(message = "O campo 'testString' não pode ser vazio")
    private String testString;

    @NotNull(message = "O campo 'language' é obrigatório")
    private RegexLanguage language;
}
