package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItem;

    @NotBlank
    @Column(name = "numero_serie", nullable = false, length = 80, unique = true)
    private String numeroSerie;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "titulo_id", nullable = false)
    private Titulo titulo;

    @NotNull
    @Column(name = "data_aquisicao", nullable = false)
    private LocalDate dataAquisicao;

    @NotBlank
    @Column(name = "tipo_item", nullable = false, length = 20)
    private String tipoItem; // FITA, DVD, BLURAY

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Locacao> locacaoes = new ArrayList<>();

    public Item() {}

    public Item(Long idItem, String numeroSerie, Titulo titulo, LocalDate dataAquisicao, String tipoItem, List<Locacao> locacaoes) {
        this.idItem = idItem;
        this.numeroSerie = numeroSerie;
        this.titulo = titulo;
        this.dataAquisicao = dataAquisicao;
        this.tipoItem = tipoItem;
        this.locacaoes = locacaoes;
    }

    public List<Locacao> getLocacaoes() {
        return locacaoes;
    }

    public void setLocacaoes(List<Locacao> locacaoes) {
        this.locacaoes = locacaoes;
    }

    // getters/setters
    public Long getIdItem() { return idItem; }
    public void setIdItem(Long idItem) { this.idItem = idItem; }

    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }

    public Titulo getTitulo() { return titulo; }
    public void setTitulo(Titulo titulo) { this.titulo = titulo; }

    public LocalDate getDataAquisicao() { return dataAquisicao; }
    public void setDataAquisicao(LocalDate dataAquisicao) { this.dataAquisicao = dataAquisicao; }

    public String getTipoItem() { return tipoItem; }
    public void setTipoItem(String tipoItem) { this.tipoItem = tipoItem; }
}
