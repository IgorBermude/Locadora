package com.example.DevWeb2.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SocioDTO extends ClienteDTO {
    @NotBlank(message = "cpf é obrigatório")
    @Pattern(regexp = "^[0-9]{6,14}$", message = "cpf deve conter apenas dígitos")
    private String cpf;
    @NotBlank(message = "tel é obrigatório")
    private String tel;
    private List<Long> dependenteIds;

    public SocioDTO() {}

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTel() { return tel; }
    public void setTel(String tel) { this.tel = tel; }

    public List<Long> getDependenteIds() { return dependenteIds; }
    public void setDependenteIds(List<Long> dependenteIds) { this.dependenteIds = dependenteIds; }
}
