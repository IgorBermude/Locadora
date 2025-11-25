package com.example.DevWeb2.dto;

import jakarta.validation.constraints.NotNull;

public class DependenteDTO extends ClienteDTO {
    @NotNull(message = "clienteId é obrigatório")
    private Long clienteId;

    public DependenteDTO() {}

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }


}
