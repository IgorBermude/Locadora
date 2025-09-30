package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Entity
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idClasse;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataDevolucao;

    @OneToMany(mappedBy = "classe")
    private Set<Titulo> titulos;

    // Getters and setters
    public Long getIdClasse() { return idClasse; }
    public void setIdClasse(Long idClasse) { this.idClasse = idClasse; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public LocalDate getDataDevolucao() { return dataDevolucao; }
    public void setDataDevolucao(LocalDate dataDevolucao) { this.dataDevolucao = dataDevolucao; }
    public Set<Titulo> getTitulos() { return titulos; }
    public void setTitulos(Set<Titulo> titulos) { this.titulos = titulos; }
}
