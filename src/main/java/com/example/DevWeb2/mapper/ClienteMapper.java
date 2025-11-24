package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Locacao;
import com.example.DevWeb2.dto.ClienteDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class ClienteMapper {
    private ClienteMapper() {}

    public static ClienteDTO toDTO(Cliente c) {
        if (c == null) return null;
        ClienteDTO dto = new ClienteDTO();
        dto.setIdCliente(c.getIdCliente());
        dto.setNome(c.getNome());
        dto.setNumInscricao(c.getNumInscricao());
        dto.setDtNascimento(c.getDtNascimento());
        dto.setSexo(c.getSexo());
        dto.setEstahAtivo(c.isEstahAtivo());
        if (c.getLocacaoes() != null) {
            List<Long> ids = c.getLocacaoes().stream().map(Locacao::getIdLocacao).collect(Collectors.toList());
            dto.setLocacaoIds(ids);
        }
        return dto;
    }
}

