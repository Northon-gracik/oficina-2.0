package com.oficina.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class EficienciaMecanicosDTO {
    private String nomeMecanico;
    private Long tarefasConcluidas;
    private BigDecimal custoTotal;

    public EficienciaMecanicosDTO(String nomeMecanico, Long tarefasConcluidas, BigDecimal custoTotal) {
        this.nomeMecanico = nomeMecanico.substring(0, 1).toUpperCase() + nomeMecanico.substring(1);
        this.tarefasConcluidas = tarefasConcluidas;
        this.custoTotal = custoTotal;
    }

    // Getters e Setters
}
