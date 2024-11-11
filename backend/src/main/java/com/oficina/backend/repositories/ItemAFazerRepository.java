package com.oficina.backend.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oficina.backend.dto.ItensAFazerStatusDTO;
import com.oficina.backend.dto.ItensMaiorCustoDTO;
import com.oficina.backend.dto.RelatorioItemAFazerDTO;
import com.oficina.backend.dto.ItemPorTipoDTO;
import com.oficina.backend.entitities.ItemAFazer;
import com.oficina.backend.enums.StatusManutencao;

public interface ItemAFazerRepository extends JpaRepository<ItemAFazer, Long> {
        @Query("SELECT new com.oficina.backend.dto.RelatorioItemAFazerDTO(" +
                        "ia.descricao, ia.tipoMecanico, ia.statusManutencao, ia.tipoManutencao, " +
                        "ia.valorTotalPecas, ia.valorMaoDeObra, " +
                        "SUM(ia.valorTotalPecas + ia.valorMaoDeObra), ia.tempoEstimado, ia.horaInicio, ia.horaFim, " +
                        "SUM(CASE WHEN true THEN 1 ELSE 0 END), " +
                        // "SUM(CASE WHEN ia.horaFim <= (ia.horaInicio + ia.tempoEstimado) THEN 1 ELSE 0
                        // END), " +
                        "AVG(ia.valorTotalPecas + ia.valorMaoDeObra)) " +
                        "FROM ItemAFazer ia " +
                        "WHERE ia.horaInicio BETWEEN :dataInicio AND :dataFim " +
                        "AND (:status IS NULL OR ia.statusManutencao = :status) " +
                        "GROUP BY ia.descricao, ia.tipoMecanico, ia.statusManutencao, ia.tipoManutencao, " +
                        "ia.valorTotalPecas, ia.valorMaoDeObra, ia.tempoEstimado, ia.horaInicio, ia.horaFim")
        List<RelatorioItemAFazerDTO> findRelatorioItensAFazer(
                        @Param("dataInicio") LocalDateTime dataInicio,
                        @Param("dataFim") LocalDateTime dataFim,
                        @Param("status") StatusManutencao status);

        @Query("SELECT new com.oficina.backend.dto.ItensAFazerStatusDTO(LOWER(i.descricao), i.statusManutencao, COUNT(i)) "
                        +
                        "FROM ItemAFazer i GROUP BY LOWER(i.descricao), i.statusManutencao")
        List<ItensAFazerStatusDTO> findItensAFazerStatus();

        @Query("SELECT new com.oficina.backend.dto.ItemPorTipoDTO(item.tipoManutencao, COUNT(item)) " +
                        "FROM ItemAFazer item GROUP BY item.tipoManutencao")
        List<ItemPorTipoDTO> findItensPorTipo();

        @Query("SELECT new com.oficina.backend.dto.ItensMaiorCustoDTO(i.descricao, SUM(i.valorTotalPecas + i.valorMaoDeObra)) "
                        +
                        "FROM ItemAFazer i " +
                        "GROUP BY i.descricao ORDER BY SUM(i.valorTotalPecas + i.valorMaoDeObra) DESC " +
                        "LIMIT 10")
        List<ItensMaiorCustoDTO> findItensComMaiorCusto();

}
