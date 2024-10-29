package com.oficina.backend.entitities;

import java.math.BigDecimal;
import java.time.LocalDateTime;


import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.time.Duration;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oficina.backend.enums.FormaPagamento;
import com.oficina.backend.enums.StatusPagamento;
import com.oficina.backend.enums.StatusServico;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    @JsonManagedReference
    private Vehicle vehicle;

    private String descricao;

    @Column(name = "data_inicio")
    private Date dataInicio;

    @Column(name = "data_conclusao")
    private Date dataConclusao;

    @Enumerated(EnumType.STRING)
    private StatusServico status;

    @ManyToOne
    @JoinColumn(name = "mecanico_id")
    private User mecanico;

    @Column(name = "custo_estimado", precision = 10, scale = 2)
    private BigDecimal custoEstimado;

    @Column(name = "custo_final", precision = 10, scale = 2)
    private BigDecimal custoFinal;

    @Column(name = "tempo_estimado")
    private Duration tempoEstimado; // em horas

    @Column(name = "tempo_real")
    private Duration tempoReal; // em horas

    // @ElementCollection
    // private List<String> notas = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento")
    private FormaPagamento formaPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento")
    private StatusPagamento statusPagamento;

    @Column(name = "valor_pagamento", precision = 10, scale = 2)
    private BigDecimal valorPagamento;

    @OneToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @OneToOne
    @JoinColumn(name = "inspecao_entrada_id")
    private Inspecao inspecaoEntrada;

    @OneToOne
    @JoinColumn(name = "orcamento_id")
    private Orcamento orcamento;

    @OneToOne
    @JoinColumn(name = "manutencao_id")
    private Manutencao manutencao;

    @OneToOne
    @JoinColumn(name = "inspecao_saida_id")
    private Inspecao inspecaoSaida;

    @OneToOne
    @JoinColumn(name = "entrega_id")
    private Entrega entrega;

}
