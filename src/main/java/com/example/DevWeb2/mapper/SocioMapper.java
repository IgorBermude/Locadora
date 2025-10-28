package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.dto.SocioDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class SocioMapper {
    private SocioMapper() {}

    public static SocioDTO toDTO(Socio s) {
        if (s == null) return null;
        SocioDTO dto = new SocioDTO();
        dto.setIdCliente(s.getIdCliente());
        dto.setNome(s.getNome());
        dto.setNumInscricao(s.getNumInscricao());
        dto.setDtNascimento(s.getDtNascimento());
        dto.setSexo(s.getSexo());
        dto.setEstahAtivo(s.isEstahAtivo());
        dto.setCpf(s.getCpf());
        dto.setTel(s.getTel());
        if (s.getDependentes() != null) {
            List<Long> ids = s.getDependentes().stream().map(Dependente::getIdCliente).collect(Collectors.toList());
            dto.setDependenteIds(ids);
        }
        return dto;
    }

    public static Socio toDomain(SocioDTO dto) {
        if (dto == null) return null;
        Socio s = new Socio();
        s.setIdCliente(dto.getIdCliente());
        s.setNome(dto.getNome());
        s.setNumInscricao(dto.getNumInscricao());
        s.setDtNascimento(dto.getDtNascimento());
        s.setSexo(dto.getSexo());
        s.setEstahAtivo(dto.isEstahAtivo());
        s.setCpf(dto.getCpf());
        s.setTel(dto.getTel());
        return s;
    }
}

