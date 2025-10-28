package com.example.DevWeb2.dto;

import java.util.List;

public class SocioDTO extends ClienteDTO {
    private String cpf;
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
