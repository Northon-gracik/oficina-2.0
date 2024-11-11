package com.oficina.backend.dto;

import com.oficina.backend.enums.StatusManutencao;

import lombok.Data;

@Data
public class ItensAFazerStatusDTO {
    private String descricao;
    private StatusManutencao status;
    private Long quantidade;

    public ItensAFazerStatusDTO(String descricao, StatusManutencao status, Long quantidade) {
        this.descricao = descricao.substring(0, 1).toUpperCase() + descricao.substring(1);
        this.status = status;
        this.quantidade = quantidade;
    }

    // Getters e Setters
}
