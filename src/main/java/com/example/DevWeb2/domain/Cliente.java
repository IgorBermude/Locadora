package com.example.DevWeb2.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @Column(nullable = false, unique = true)
    private int numInscricao;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false)
    private LocalDate dtNascimento;

    @Column(nullable = false, length = 10)
    private String sexo;

    @Column(nullable = false)
    private boolean estahAtivo;

    // mappedBy ajustado para o nome do atributo em Locacao (\"cliente\")
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Locacao> locacaoes = new ArrayList<>();

    public Cliente () {}

    public Cliente(Long idCliente, int numInscricao, String nome, LocalDate dtNascimento, String sexo, boolean estahAtivo, List<Locacao> locacaoes) {
        this.idCliente = idCliente;
        this.numInscricao = numInscricao;
        this.nome = nome;
        this.dtNascimento = dtNascimento;
        this.sexo = sexo;
        this.estahAtivo = estahAtivo;
        this.locacaoes = locacaoes;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public List<Locacao> getLocacaoes() {
        return locacaoes;
    }

    public void setLocacaoes(List<Locacao> locacaoes) {
        this.locacaoes = locacaoes;
    }

    public int getNumInscricao() {
        return numInscricao;
    }

    public void setNumInscricao(int numInscricao) {
        this.numInscricao = numInscricao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDtNascimento() {
        return dtNascimento;
    }

    public void setDtNascimento(LocalDate dtNascimento) {
        this.dtNascimento = dtNascimento;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public boolean isEstahAtivo() {
        return estahAtivo;
    }

    public void setEstahAtivo(boolean estahAtivo) {
        this.estahAtivo = estahAtivo;
    }
}
