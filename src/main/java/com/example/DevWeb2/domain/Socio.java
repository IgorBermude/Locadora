package com.example.DevWeb2.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("SOCIO")
public class Socio extends Cliente{
    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 15)
    private String tel;

    @OneToMany(mappedBy = "socio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Dependente> dependentes = new ArrayList<>();

    public Socio(){}

    public Socio(Long idCliente, int numInscricao, String nome, LocalDate dtNascimento, String sexo, boolean estahAtivo, List<Locacao> locacaoes, String cpf, String tel, List<Dependente> dependentes) {
        super(idCliente, numInscricao, nome, dtNascimento, sexo, estahAtivo, locacaoes);
        this.cpf = cpf;
        this.tel = tel;
        this.dependentes = dependentes;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public List<Dependente> getDependentes() {
        return dependentes;
    }

    public void setDependentes(List<Dependente> dependentes) {
        this.dependentes = dependentes;
    }


}
