package com.example.DevWeb2.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.PersistenceException;
import org.hibernate.Hibernate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@DiscriminatorValue("DEPENDENTE")

public class Dependente extends Cliente{
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "socio_id", nullable = true)
    @JsonBackReference(value="socio-dependentes")
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

    @PrePersist
    @PreUpdate
    private void validateSocioIsSocio() {
        if (this.socio == null) {
            throw new PersistenceException("Dependente precisa referenciar um Socio (socio não pode ser nulo).");
        }
        Class<?> actual = Hibernate.getClass(this.socio);
        if (!Socio.class.equals(actual)) {
            throw new PersistenceException("O campo `socio` deve referenciar uma entidade do tipo Socio.");
        }
    }
}
