package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@DiscriminatorValue("DEPENDENTE")
public class Dependente extends Cliente{
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "socio_id")
    private Socio socio;

    public Dependente() {}

    public Dependente(Long idCliente, int numInscricao, String nome, LocalDate dtNascimento, String sexo, boolean estahAtivo, List<Locacao> locacaoes, Socio socio) {
        super(idCliente, numInscricao, nome, dtNascimento, sexo, estahAtivo, locacaoes);
        this.socio = socio;
    }

    public Socio getSocio() {
        return socio;
    }

    public void setSocio(Socio socio) {
        this.socio = socio;
    }
}
