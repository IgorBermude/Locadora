package com.example.DevWeb2.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ClasseDTO {
    private Long idClasse;
    private String nome;
    private BigDecimal valor;
    private LocalDate dataDevolucao;

    // getters e setters
    public Long getIdClasse() { return idClasse; }
    public void setIdClasse(Long idClasse) { this.idClasse = idClasse; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getDataDevolucao() { return dataDevolucao; }
    public void setDataDevolucao(LocalDate dataDevolucao) { this.dataDevolucao = dataDevolucao; }
}
