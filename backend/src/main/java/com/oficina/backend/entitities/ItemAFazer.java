package com.oficina.backend.entitities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oficina.backend.enums.StatusManutencao;
import com.oficina.backend.enums.TipoManutencao;
import com.oficina.backend.enums.TipoMecanico;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "item_a_fazer")
public class ItemAFazer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_mecanico")
    private TipoMecanico tipoMecanico;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_manutencao")
    private StatusManutencao statusManutencao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_manutencao")
    private TipoManutencao tipoManutencao;

    @Column(name = "valor_total_pecas")
    private double valorTotalPecas;

    @Column(name = "valor_mao_de_obra")
    private double valorMaoDeObra;
    
    @OneToMany(mappedBy = "itemAFazer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private java.util.List<Peca> pecas = new ArrayList<>();    

    @ManyToOne
    @JoinColumn(name = "orcamento_id")
    @JsonBackReference("orcamento-itemAFazer")
    private Orcamento orcamento;
    
    @ManyToOne
    @JoinColumn(name = "manutencao_id")
    @JsonBackReference("manutencao-itemAFazer")
    private Manutencao manutencao;
}
