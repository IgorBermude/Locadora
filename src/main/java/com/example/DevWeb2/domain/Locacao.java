package com.example.DevWeb2.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "locacoes")
public class Locacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLocacao;

    @Column(nullable = false)
    private LocalDate dtLocacao;

    @Column(nullable = false)
    private LocalDate dtDevolucaoPrevista;

    @Column()
    private LocalDate dtDevolucaoEfetiva;

    @Column(nullable = false)
    private BigDecimal valorCobrado;

    @Column()
    private BigDecimal multaCobrada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id")
    private Item item;

    public Locacao() {}

    public Locacao(Long idLocacao, LocalDate dtLocacao, LocalDate dtDevolucaoPrevista, LocalDate dtDevolucaoEfetiva, BigDecimal valorCobrado, BigDecimal multaCobrada, Cliente cliente, Item item) {
        this.idLocacao = idLocacao;
        this.dtLocacao = dtLocacao;
        this.dtDevolucaoPrevista = dtDevolucaoPrevista;
        this.dtDevolucaoEfetiva = dtDevolucaoEfetiva;
        this.valorCobrado = valorCobrado;
        this.multaCobrada = multaCobrada;
        this.cliente = cliente;
        this.item = item;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public BigDecimal getMultaCobrada() {
        return multaCobrada;
    }

    public void setMultaCobrada(BigDecimal multaCobrada) {
        this.multaCobrada = multaCobrada;
    }

    public BigDecimal getValorCobrado() {
        return valorCobrado;
    }

    public void setValorCobrado(BigDecimal valorCobrado) {
        this.valorCobrado = valorCobrado;
    }

    public LocalDate getDtDevolucaoEfetiva() {
        return dtDevolucaoEfetiva;
    }

    public void setDtDevolucaoEfetiva(LocalDate dtDevolucaoEfetiva) {
        this.dtDevolucaoEfetiva = dtDevolucaoEfetiva;
    }

    public LocalDate getDtDevolucaoPrevista() {
        return dtDevolucaoPrevista;
    }

    public void setDtDevolucaoPrevista(LocalDate dtDevolucaoPrevista) {
        this.dtDevolucaoPrevista = dtDevolucaoPrevista;
    }

    public LocalDate getDtLocacao() {
        return dtLocacao;
    }

    public void setDtLocacao(LocalDate dtLocacao) {
        this.dtLocacao = dtLocacao;
    }

    public Long getIdLocacao() {
        return idLocacao;
    }

    public void setIdLocacao(Long idLocacao) {
        this.idLocacao = idLocacao;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
