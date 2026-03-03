package com.gabrieudev.regexbuilder.application.dto.regex;

import org.hibernate.validator.constraints.Length;

import com.gabrieudev.regexbuilder.domain.enums.RegexLanguage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRegexRequest {
    @NotBlank(message = "O campo 'pattern' é obrigatório")
    @NotNull(message = "O campo 'pattern' é obrigatório")
    @Length(max = 1000, message = "O campo 'pattern' deve ter no máximo 1000 caracteres")
    private String pattern;

    private String description;

    @NotNull(message = "O campo 'language' é obrigatório")
    private RegexLanguage language;
}
