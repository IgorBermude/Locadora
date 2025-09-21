package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "atores")
public class Ator {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long idAtor;

    @Column(nullable = false, length = 120)
    private String nome;

    @ManyToMany
    @JoinTable(
            name = "ator_titulo",
            joinColumns = @JoinColumn(name = "ator_id"),
            inverseJoinColumns = @JoinColumn(name = "titulo_id")
    )
    private List<Titulo> titulos = new ArrayList<>();

    public Ator() {}

    public Ator(Long idAtor, String nome) {
        this.idAtor = idAtor;
        this.nome = nome;
    }

    public Ator(Long idAtor, String nome, List<Titulo> titulos) {
        this.idAtor = idAtor;
        this.nome = nome;
        this.titulos = titulos;
    }

    // Métodos anteriores (compatibilidade)
    public Long getId() { return idAtor; }
    public void setId(Long id) { this.idAtor = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<Titulo> getTitulos() { return titulos; }
    public void setTitulos(List<Titulo> titulos) { this.titulos = titulos; }

    public void addTitulo(Titulo titulo){
        if(!this.titulos.contains(titulo)){
            this.titulos.add(titulo);
        }
        if(!titulo.getAtores().contains(this)){
            titulo.getAtores().add(this);
        }
    }
}
