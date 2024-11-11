package com.oficina.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RelatorioPecaUtilizadaDTO {
    private String nomePeca;
    private Integer quantidadeUtilizada;
    private BigDecimal valorTotal;

    public RelatorioPecaUtilizadaDTO(String nomePeca, Number quantidadeUtilizada, BigDecimal valorTotal) {
        this.nomePeca = nomePeca;
        this.quantidadeUtilizada = quantidadeUtilizada.intValue();
        this.valorTotal = valorTotal;
    }

    // Getters e Setters
}
