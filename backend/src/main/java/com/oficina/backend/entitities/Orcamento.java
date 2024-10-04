package com.oficina.backend.entitities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oficina.backend.enums.StatusOrcamento;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "data_prevista")
    private LocalDateTime dataPrevista;

    @Column(name = "data_validade")
    private LocalDateTime dataValidade;

    @Column(name = "custo_total_estimado")
    private double custoTotalEstimado;

    @Enumerated(EnumType.STRING)
    private StatusOrcamento status;

    @Column(name = "responsavel_emissao")
    private String responsavelEmissao;

    @OneToMany(mappedBy = "orcamento",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("orcamento-itemAFazer")
    private java.util.List<ItemAFazer> itensAFazer = new ArrayList<>();
}