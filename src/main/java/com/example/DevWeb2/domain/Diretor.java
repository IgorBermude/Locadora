package com.example.DevWeb2.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diretores")
public class Diretor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDiretor;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @OneToMany(mappedBy = "diretor")
    @JsonIgnore // 👈 evita recursão infinita no JSON
    private List<Titulo> titulos = new ArrayList<>();

    public Diretor() {
    }

    public Diretor(Long idDiretor, String nome) {
        this.idDiretor = idDiretor;
        this.nome = nome;
    }

    public Long getIdDiretor() {
        return idDiretor;
    }

    public void setIdDiretor(Long idDiretor) {
        this.idDiretor = idDiretor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Titulo> getTitulos() {
        return titulos;
    }

    public void setTitulos(List<Titulo> titulos) {
        this.titulos = titulos;
    }
}
