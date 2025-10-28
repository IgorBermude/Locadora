package com.example.DevWeb2.dto;

public class DependenteDTO extends ClienteDTO {
    private Long socioId;

    public DependenteDTO() {}

    public Long getSocioId() { return socioId; }
    public void setSocioId(Long socioId) { this.socioId = socioId; }
}
