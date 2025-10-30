package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.dto.ClasseDTO;

public final class ClasseMapper {
    // Converte entidade Classe em DTO
    public static ClasseDTO toDTO(Classe classe) {
        ClasseDTO dto = new ClasseDTO();
        dto.setIdClasse(classe.getIdClasse());
        dto.setNome(classe.getNome());
        dto.setValor(classe.getValor());
        dto.setDataDevolucao(classe.getDataDevolucao());
        return dto;
    }
}
