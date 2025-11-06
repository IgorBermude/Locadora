package com.example.DevWeb2.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.*;

public class ClienteDTO {
    private Long idCliente;
    @Positive(message = "numInscricao deve ser positivo")
    private int numInscricao;
    @NotBlank(message = "nome é obrigatório")
    private String nome;
    @NotNull(message = "dtNascimento é obrigatória")
    private LocalDate dtNascimento;
    @NotBlank(message = "sexo é obrigatório")
    private String sexo;
    private boolean estahAtivo;
    private List<Long> locacaoIds; // resumo: ids das locações

    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public int getNumInscricao() { return numInscricao; }
    public void setNumInscricao(int numInscricao) { this.numInscricao = numInscricao; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public LocalDate getDtNascimento() { return dtNascimento; }
    public void setDtNascimento(LocalDate dtNascimento) { this.dtNascimento = dtNascimento; }
    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }
    public boolean isEstahAtivo() { return estahAtivo; }
    public void setEstahAtivo(boolean estahAtivo) { this.estahAtivo = estahAtivo; }
    public List<Long> getLocacaoIds() { return locacaoIds; }
    public void setLocacaoIds(List<Long> locacaoIds) { this.locacaoIds = locacaoIds; }
}
