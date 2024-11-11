package com.oficina.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RelatorioPecaDTO {
    private final String nome;
    private final Integer quantidade;
    private final BigDecimal valorTotalPecas;
    private final BigDecimal valorTotalMaoDeObra;
    private final BigDecimal valorTotal;

    public RelatorioPecaDTO(String nome, Integer quantidade, BigDecimal valorTotalPecas, BigDecimal valorTotalMaoDeObra, BigDecimal valorTotal) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.valorTotalPecas = valorTotalPecas;
        this.valorTotalMaoDeObra = valorTotalMaoDeObra;
        this.valorTotal = valorTotal;
    }
}

