package com.oficina.backend.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oficina.backend.dto.EficienciaMecanicosDTO;
import com.oficina.backend.dto.RelatorioManutencaoConcluidaDTO;
import com.oficina.backend.entitities.Manutencao;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
        @Query("SELECT new com.oficina.backend.dto.RelatorioManutencaoConcluidaDTO(" +
                        "COUNT(m), SUM(m.custosReais)) " +
                        "FROM Manutencao m WHERE m.dataConclusao BETWEEN :dataInicio AND :dataFim "
        // +
        // "GROUP BY "
        )
        List<RelatorioManutencaoConcluidaDTO> findRelatorioManutencoesConcluidas(
                        @Param("dataInicio") LocalDateTime dataInicio,
                        @Param("dataFim") LocalDateTime dataFim);

        @Query("SELECT new com.oficina.backend.dto.EficienciaMecanicosDTO(LOWER(m.tecnicoResponsavel), COUNT(m), SUM(m.custosReais)) " +
                        "FROM Manutencao m " +
                        "GROUP BY m.tecnicoResponsavel")
        List<EficienciaMecanicosDTO> findEficienciaMecanicos();
}
