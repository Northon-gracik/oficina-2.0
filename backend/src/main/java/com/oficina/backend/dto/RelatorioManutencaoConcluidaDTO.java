package com.oficina.backend.dto;

import java.math.BigDecimal;

import com.oficina.backend.enums.TipoManutencao;

import lombok.Data;

@Data
public class RelatorioManutencaoConcluidaDTO {
    private Long quantidade;
    private BigDecimal valorTotal;

    public RelatorioManutencaoConcluidaDTO(Long quantidade, BigDecimal valorTotal) {
        this.quantidade = quantidade;
        this.valorTotal = valorTotal;
    }

    // Getters e Setters
}