package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.dto.TituloDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class TituloMapper {
    public static TituloDTO tituloToDTO(Titulo titulo) {
        TituloDTO dto = new TituloDTO();
        dto.setNome(titulo.getNome());
        dto.setIdTitulo(titulo.getIdTitulo());
        if(titulo.getClasse() != null) {
            dto.setClasse(ClasseMapper.toDTO(titulo.getClasse()));
        }
        return dto;
    }
}
