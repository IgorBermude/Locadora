package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.dto.DependenteDTO;

public final class DependenteMapper {
    private DependenteMapper() {}

    public static DependenteDTO toDTO(Dependente d) {
        if (d == null) return null;
        DependenteDTO dto = new DependenteDTO();
        dto.setIdCliente(d.getIdCliente());
        dto.setNome(d.getNome());
        dto.setNumInscricao(d.getNumInscricao());
        dto.setDtNascimento(d.getDtNascimento());
        dto.setSexo(d.getSexo());
        dto.setEstahAtivo(d.isEstahAtivo());
        if (d.getSocio() != null) dto.setClienteId(d.getSocio().getIdCliente());
        return dto;
    }

    public static Dependente toDomain(DependenteDTO dto, Socio socio) {
        if (dto == null) return null;
        Dependente d = new Dependente();
        d.setIdCliente(dto.getIdCliente());
        d.setNome(dto.getNome());
        d.setNumInscricao(dto.getNumInscricao());
        d.setDtNascimento(dto.getDtNascimento());
        d.setSexo(dto.getSexo());
        d.setEstahAtivo(dto.isEstahAtivo());
        d.setSocio(socio);
        return d;
    }
}
