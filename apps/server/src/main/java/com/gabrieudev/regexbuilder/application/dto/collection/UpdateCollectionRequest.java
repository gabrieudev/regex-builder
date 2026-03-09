package com.gabrieudev.regexbuilder.application.dto.collection;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCollectionRequest {
    @NotNull(message = "Campo 'name' é obrigatório")
    @NotBlank(message = "Campo 'name' não pode ser vazio")
    private String name;

    private String description;

    @NotNull(message = "Campo 'color' é obrigatório")
    @NotBlank(message = "Campo 'color' não pode ser vazio")
    private String color;

    @NotNull(message = "Campo 'icon' é obrigatório")
    @NotBlank(message = "Campo 'icon' não pode ser vazio")
    private String icon;

    @NotNull(message = "Campo 'tags' é obrigatório")
    private List<String> tags;
}
