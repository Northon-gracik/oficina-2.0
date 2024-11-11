package com.oficina.backend.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.time.Duration;
import com.oficina.backend.enums.StatusManutencao;
import com.oficina.backend.enums.TipoManutencao;
import com.oficina.backend.enums.TipoMecanico;

import lombok.Data;

@Data
public class RelatorioItemAFazerDTO {
    private String descricao;
    private TipoMecanico tipoMecanico;
    private StatusManutencao statusManutencao;
    private TipoManutencao tipoManutencao;
    private BigDecimal valorTotalPecas;
    private BigDecimal valorMaoDeObra;
    private BigDecimal valorTotal;
    private Duration tempoEstimado;
    private Date horaInicio;
    private Date horaFim;
    private Long totalItensConcluidosNoPrazo;
    private Double valorMedioItens;

    // Construtor atualizado com todos os parâmetros
    public RelatorioItemAFazerDTO(
            String descricao,
            TipoMecanico tipoMecanico,
            StatusManutencao statusManutencao,
            TipoManutencao tipoManutencao,
            BigDecimal valorTotalPecas,
            BigDecimal valorMaoDeObra,
            BigDecimal valorTotal,
            Duration tempoEstimado,
            Date horaInicio,
            Date horaFim,
            Long totalItensConcluidosNoPrazo,
            Double valorMedioItens) {
        this.descricao = descricao;
        this.tipoMecanico = tipoMecanico;
        this.statusManutencao = statusManutencao;
        this.tipoManutencao = tipoManutencao;
        this.valorTotalPecas = valorTotalPecas;
        this.valorMaoDeObra = valorMaoDeObra;
        this.valorTotal = valorTotal;
        this.tempoEstimado = tempoEstimado;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.totalItensConcluidosNoPrazo = totalItensConcluidosNoPrazo;
        this.valorMedioItens = valorMedioItens;
    }

    // Getters e Setters
}