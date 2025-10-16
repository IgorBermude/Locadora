package com.example.DevWeb2.dto;

import java.util.List;

public class DiretorDTO {
    private Long idDiretor;
    private String nome;
    private List<TituloDTO> titulos;

    // getters e setters
    public Long getIdDiretor() { return idDiretor; }
    public void setIdDiretor(Long idDiretor) { this.idDiretor = idDiretor; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<TituloDTO> getTitulos() { return titulos; }
    public void setTitulos(List<TituloDTO> titulos) { this.titulos = titulos; }
}
