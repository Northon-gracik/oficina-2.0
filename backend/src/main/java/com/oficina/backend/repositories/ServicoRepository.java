package com.oficina.backend.repositories;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oficina.backend.entitities.Servico;
import com.oficina.backend.enums.StatusServico;
import com.oficina.backend.dto.CustoMedioClienteDTO;
import com.oficina.backend.dto.CustoMedioServicoDTO;
import com.oficina.backend.dto.PrecoMedioMarcaDTO;
import com.oficina.backend.dto.RelatorioServicoDTO;
import com.oficina.backend.dto.StatusServicosDTO;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

        public Servico findByManutencaoId(Long id);

        @Query("SELECT new com.oficina.backend.dto.RelatorioServicoDTO(" +
                        "a.descricaoProblema, s.status, a.dataAgendamento, " +
                        "s.tempoEstimado, s.custoEstimado, s.custoFinal) " +
                        "FROM Servico s " +
                        "JOIN s.agendamento a " +
                        "WHERE a.dataAgendamento BETWEEN :dataInicio AND :dataFim " +
                        "AND (:status IS NULL OR s.status = :status)")
        List<RelatorioServicoDTO> findRelatorioServicos(
                        @Param("dataInicio") LocalDateTime dataInicio,
                        @Param("dataFim") LocalDateTime dataFim,
                        @Param("status") StatusServico status);

        @Query("SELECT new com.oficina.backend.dto.StatusServicosDTO(s.status, COUNT(s)) " +
                        "FROM Servico s GROUP BY s.status")
        List<StatusServicosDTO> findStatusCount();

        @Query("SELECT AVG(s.custoFinal) FROM Servico s WHERE s.status = 'FINALIZADO'")
        Double findCustoMedioPorServico();

        @Query("SELECT new com.oficina.backend.dto.PrecoMedioMarcaDTO(v.marca, SUM(s.custoFinal)) " +
                        "FROM Servico s JOIN s.vehicle v WHERE s.status = 'FINALIZADO' GROUP BY v.marca")
        List<PrecoMedioMarcaDTO> findPrecoMedioPorMarca();

        
        @Query("SELECT new com.oficina.backend.dto.PrecoMedioMarcaDTO(v.marca, v.modelo, SUM(s.custoFinal)) " +
                        "FROM Servico s JOIN s.vehicle v WHERE s.status = 'FINALIZADO' GROUP BY v.marca, v.modelo")
        List<PrecoMedioMarcaDTO> findPrecoMedioPorVeiculo();

        
        @Query("SELECT new com.oficina.backend.dto.CustoMedioClienteDTO(c.nomeCompleto, AVG(s.custoFinal)) " +
                        "FROM Servico s JOIN s.vehicle v JOIN v.client c GROUP BY c.nomeCompleto")
        List<CustoMedioClienteDTO> findCustoMedioPorCliente();

        @Query("SELECT SUM(s.custoFinal) / COUNT(distinct v.client) FROM Servico s JOIN Vehicle v ON s.vehicle.id = v.id WHERE s.status = 'FINALIZADO'")
        Double findCustoMedioDosClientes();

        @Query("SELECT SUM(s.custoFinal) / COUNT(distinct v.marca) FROM Servico s JOIN Vehicle v ON s.vehicle.id = v.id WHERE s.status = 'FINALIZADO'")
        Double findCustoMedioDasMarcas();

        @Query("SELECT SUM(s.custoFinal) / COUNT(distinct v.modelo) FROM Servico s JOIN Vehicle v ON s.vehicle.id = v.id WHERE s.status = 'FINALIZADO'")
        Double findCustoMedioDosVeiculos();
		

}
/*
 * SELECT a.descricao_problema, s.status, s.tempo_estimado, s.custo_estimado,
 * s.custo_final
 * FROM emp_01234567891231.servico s
 * JOIN emp_01234567891231.agendamento a on s.agendamento_id = a.id
 * WHERE a.data_agendamento BETWEEN '2024-01-01T00:00' AND '2024-12-31T00:0'
 * AND s.status = 'FINALIZADO'
 */

// @Query("SELECT new com.oficina.backend.dto.CumprimentoPrazoDTO(" +
// "COUNT(s), " +
// "SUM(CASE WHEN s.dataConclusao <= s.dataPrevista THEN 1 ELSE 0 END), " +
// "SUM(CASE WHEN s.dataConclusao > s.dataPrevista THEN 1 ELSE 0 END)) " +
// "FROM Servico s")
// CumprimentoPrazoDTO findCumprimentoPrazo();
