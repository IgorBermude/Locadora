package com.example.DevWeb2.mapper;

import com.example.DevWeb2.domain.Locacao;
import com.example.DevWeb2.dto.LocacaoDTO;

public class LocacaoMapper {

    public static LocacaoDTO toDTO(Locacao loc) {
        return new LocacaoDTO(
                loc.getIdLocacao(),
                loc.getCliente().getIdCliente(),
                loc.getItem().getIdItem(),
                loc.getDtLocacao() != null ? loc.getDtLocacao().toString() : null,
                loc.getDtDevolucaoPrevista() != null ? loc.getDtDevolucaoPrevista().toString() : null,
                loc.getValorCobrado() != null ? loc.getValorCobrado().toString() : null,
                loc.getMultaCobrada() != null ? loc.getMultaCobrada().toString() : null);
    }
}