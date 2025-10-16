package com.example.DevWeb2.dto;

public class TituloDTO {
    private Long idTitulo;
    private String nome;
    private ClasseDTO classe;

    // getters e setters
    public Long getIdTitulo() { return idTitulo; }
    public void setIdTitulo(Long idTitulo) { this.idTitulo = idTitulo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public ClasseDTO getClasse() { return classe; }
    public void setClasse(ClasseDTO classe) { this.classe = classe; }
}
