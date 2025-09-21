package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "titulos")
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTitulo;

    @Column(nullable = false, length = 160)
    private String nome;

    @ManyToMany(mappedBy = "titulos")
    private List<Ator> atores = new ArrayList<>();

    public Titulo() {}

    public Titulo(Long idTitulo, String nome) {
        this.idTitulo = idTitulo;
        this.nome = nome;
    }

    public Titulo(Long idTitulo, String nome, List<Ator> atores) {
        this.idTitulo = idTitulo;
        this.nome = nome;
        if (atores != null) this.atores = atores;
    }

    public Long getIdTitulo() { return idTitulo; }
    public void setIdTitulo(Long idTitulo) { this.idTitulo = idTitulo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<Ator> getAtores() { return atores; }
    public void setAtores(List<Ator> atores) { this.atores = atores; }
}
