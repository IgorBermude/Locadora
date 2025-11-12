package com.example.DevWeb2.domain;

import jakarta.persistence.*;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "titulos")
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTitulo;

    @Column(nullable = false, length = 160)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "diretor_id", nullable = false)
    private Diretor diretor;

    @ManyToMany(mappedBy = "titulos", fetch = FetchType.LAZY)
    private Set<Ator> atores = new HashSet<>();

    @OneToMany(mappedBy = "titulo")
    @JsonIgnore
    private Set<Item> itens;

    public Titulo() {}

    public Titulo(Long idTitulo, String nome) {
        this.idTitulo = idTitulo;
        this.nome = nome;
    }

    public Titulo(Long idTitulo, String nome, Set<Ator> atores) {
        this.idTitulo = idTitulo;
        this.nome = nome;
        if (atores != null) this.atores = atores;
    }

    public Long getIdTitulo() { return idTitulo; }
    public void setIdTitulo(Long idTitulo) { this.idTitulo = idTitulo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Set<Ator> getAtores() { return atores; }
    public void setAtores(Set<Ator> atores) { this.atores = atores; }

    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }

    public Diretor getDiretor() { return diretor; }
    public void setDiretor(Diretor diretor) { this.diretor = diretor; }

    public Set<Item> getItens() { return itens; }
    public void setItens(Set<Item> itens) { this.itens = itens; }

    public void addAtor(Ator ator) {
        if (ator == null) return;
        ator.addTitulo(this); // delega ao lado dono
    }

    public void removeAtor(Ator ator) {
        if (ator == null) return;
        ator.removeTitulo(this); // delega ao lado dono
    }
}
