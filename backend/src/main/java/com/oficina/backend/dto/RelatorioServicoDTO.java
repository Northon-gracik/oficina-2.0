package com.oficina.backend.dto;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import com.oficina.backend.enums.StatusServico;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RelatorioServicoDTO {

    private String descricao;
    private StatusServico status;
    private LocalDateTime dataAgendamento;
    private String nomeMecanico;
    private Duration tempoEstimado;
    private BigDecimal custoEstimado;
    private BigDecimal custoFinal;

    public RelatorioServicoDTO(String descricao, StatusServico status, LocalDateTime dataAgendamento,
        Duration tempoEstimado, BigDecimal custoEstimado, BigDecimal custoFinal) {
        this.descricao = descricao;
        this.status = status;
        this.dataAgendamento = dataAgendamento;
        this.nomeMecanico = "nomeMecanico";
        this.tempoEstimado = tempoEstimado;
        this.custoEstimado = custoEstimado;
        this.custoFinal = custoFinal;
    }
}

