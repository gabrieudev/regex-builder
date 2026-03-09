package com.gabrieudev.regexbuilder.application.dto.collection_regexes;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCollectionRegexesRequest {
    @NotNull(message = "Campo 'regexIds' é obrigatório")
    @NotEmpty(message = "Campo 'regexIds' não pode ser vazio")
    private List<UUID> regexIds;
}
