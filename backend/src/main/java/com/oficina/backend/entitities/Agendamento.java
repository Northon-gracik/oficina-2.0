package com.oficina.backend.entitities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.oficina.backend.enums.StatusAgendamento;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_agendamento")
    private LocalDateTime dataAgendamento;

    @Column(name = "descricao_problema")
    private String descricaoProblema;

    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;
}
