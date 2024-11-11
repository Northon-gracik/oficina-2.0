package com.oficina.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ItensMaiorCustoDTO {
    private String descricaoItem;
    private BigDecimal valorTotal;

    public ItensMaiorCustoDTO(String descricaoItem, BigDecimal valorTotal) {
        this.descricaoItem = descricaoItem;
        this.valorTotal = valorTotal;
    }

    // Getters e Setters
}
