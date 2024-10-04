package com.oficina.backend.entitities;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "data_inicio")
    private java.time.LocalDateTime dataInicio;

    @Column(name = "data_conclusao")
    private java.time.LocalDateTime dataConclusao;

    @Column(name = "descricao_detalhada")
    private String descricaoDetalhada;

    @Column(name = "custos_reais")
    private double custosReais;

    @Column(name = "comentarios_observacoes")
    private String comentariosObservacoes;

    @Column(name = "tecnico_responsavel")
    private String tecnicoResponsavel;

    @OneToMany(mappedBy = "manutencao", cascade = CascadeType.ALL)
    private java.util.List<ItemAFazer> itensAFazer = new ArrayList<>();

}