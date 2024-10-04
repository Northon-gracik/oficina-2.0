package com.oficina.backend.entitities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "responsavel_entrega")
    private String responsavelEntrega;

    @Column(name = "data_entrega")
    private java.time.LocalDateTime dataEntrega;

    @Column(name = "observacoes_entrega")
    private String observacoesEntrega;

    @Column(name = "quilometragem_entrega")
    private long quilometragemEntrega;
}
