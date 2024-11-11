package com.oficina.backend.dto;

import com.oficina.backend.enums.TipoManutencao;

import lombok.Data;

@Data
public class ItemPorTipoDTO {
    private TipoManutencao tipoManutencao;
    private Long quantidade;

    public ItemPorTipoDTO(TipoManutencao tipoManutencao, Long quantidade) {
        this.tipoManutencao = tipoManutencao;
        this.quantidade = quantidade;
    }

    // Getters e Setters
}

