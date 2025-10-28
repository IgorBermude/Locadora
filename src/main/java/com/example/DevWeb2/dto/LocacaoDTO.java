package com.example.DevWeb2.dto;

public class LocacaoDTO {
    public Long idLocacao;
    public Long clienteId;
    public Long itemId;
    public String dataLocacao;
    public String dataDevolucao;

    public LocacaoDTO(Long idLocacao, Long clienteId, Long itemId, String dataLocacao, String dataDevolucao) {
        this.idLocacao = idLocacao;
        this.clienteId = clienteId;
        this.itemId = itemId;
        this.dataLocacao = dataLocacao;
        this.dataDevolucao = dataDevolucao;
    }

    public Long getIdLocacao() {
        return idLocacao;
    }

    public void setIdLocacao(Long idLocacao) {
        this.idLocacao = idLocacao;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getDataLocacao() {
        return dataLocacao;
    }

    public void setDataLocacao(String dataLocacao) {
        this.dataLocacao = dataLocacao;
    }

    public String getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(String dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }
}
