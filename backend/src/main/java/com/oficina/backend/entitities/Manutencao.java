package com.oficina.backend.entitities;

import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "data_inicio")
    private Date dataInicio;

    @Column(name = "data_conclusao")
    private Date dataConclusao;

    @Column(name = "descricao_detalhada")
    private String descricaoDetalhada;

    @Column(name = "custos_reais", precision = 10, scale = 2)
    private BigDecimal custosReais;

    @Column(name = "comentarios_observacoes")
    private String comentariosObservacoes;

    // @ElementCollection
    // private List<String> comentariosObservacoes = new ArrayList<>();

    @Column(name = "tecnico_responsavel")
    private String tecnicoResponsavel;

    @OneToMany(mappedBy = "manutencao", cascade = CascadeType.ALL)
    private List<ItemAFazer> itensAFazer = new ArrayList<>();

}