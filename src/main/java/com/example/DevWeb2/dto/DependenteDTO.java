package com.example.DevWeb2.dto;

import jakarta.validation.constraints.NotNull;

public class DependenteDTO extends ClienteDTO {
    @NotNull(message = "socioId é obrigatório")
    private Long socioId;

    public DependenteDTO() {}

    public Long getSocioId() { return socioId; }
    public void setSocioId(Long socioId) { this.socioId = socioId; }
}
