package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "atores")
public class Ator {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idAtor;

    @Column(nullable = false, length = 120)
    private String nome;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinTable(
            name = "ator_titulo",
            joinColumns = @JoinColumn(name = "ator_id"),
            inverseJoinColumns = @JoinColumn(name = "titulo_id")
    )
    @JsonIgnore
    private Set<Titulo> titulos = new HashSet<>();

    public Ator() {}

    public Ator(Long idAtor, String nome) {
        this.idAtor = idAtor;
        this.nome = nome;
    }

    public Ator(Long idAtor, String nome, Set<Titulo> titulos) {
        this.idAtor = idAtor;
        this.nome = nome;
        this.titulos = titulos;
    }

    public void addTitulo(Titulo titulo) {
        if (titulo == null) return;
        if (this.titulos.add(titulo)) {
            titulo.getAtores().add(this);
        }
    }

    public void removeTitulo(Titulo titulo) {
        if (titulo == null) return;
        if (this.titulos.remove(titulo)) {
            titulo.getAtores().remove(this);
        }
    }

    // Expor idAtor para serialização/desserialização JSON
    public Long getIdAtor() { return idAtor; }
    public void setIdAtor(Long idAtor) { this.idAtor = idAtor; }

    // Métodos anteriores (compatibilidade interna)
    public Long getId() { return idAtor; }
    public void setId(Long id) { this.idAtor = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Set<Titulo> getTitulos() { return titulos; }
}
