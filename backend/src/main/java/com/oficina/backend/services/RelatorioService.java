package com.oficina.backend.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oficina.backend.dto.RelatorioItemAFazerDTO;
import com.oficina.backend.dto.RelatorioManutencaoConcluidaDTO;
import com.oficina.backend.dto.RelatorioPecaUtilizadaDTO;
import com.oficina.backend.dto.RelatorioResponseDTO;
import com.oficina.backend.dto.RelatorioServicoDTO;
import com.oficina.backend.enums.StatusManutencao;
import com.oficina.backend.enums.StatusServico;
import com.oficina.backend.repositories.ItemAFazerRepository;
import com.oficina.backend.repositories.ManutencaoRepository;
import com.oficina.backend.repositories.PecaRepository;
import com.oficina.backend.repositories.ServicoRepository;

@Service
public class RelatorioService {
    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private ManutencaoRepository manutencaoRepository;

    public RelatorioResponseDTO<RelatorioServicoDTO> gerarRelatorioServicos(String dataInicio, String dataFim,
            StatusServico status) {
        LocalDateTime inicio = null;
        LocalDateTime fim = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            if (dataInicio != null) {
                inicio = LocalDateTime.ofInstant(sdf.parse(dataInicio).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                inicio = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusDays(3);
            }
            if (dataFim != null) {
                fim = LocalDateTime.ofInstant(sdf.parse(dataFim).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                fim = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(3);
            }
        } catch (ParseException e) {
            e.printStackTrace();
            // Handle exception as needed
        }

        RelatorioResponseDTO<RelatorioServicoDTO> relatorioResponse = new RelatorioResponseDTO<RelatorioServicoDTO>(
                inicio.toLocalDate(),
                fim.toLocalDate(),
                status,
                servicoRepository.findRelatorioServicos(inicio, fim, status));
        return relatorioResponse;
    }

    @Autowired
    private ItemAFazerRepository itemAFazerRepository;

    public RelatorioResponseDTO<RelatorioItemAFazerDTO> gerarRelatorioItensAFazer(String dataInicio, String dataFim,
            StatusManutencao status) {
        LocalDateTime inicio = null;
        LocalDateTime fim = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            if (dataInicio != null) {
                inicio = LocalDateTime.ofInstant(sdf.parse(dataInicio).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                inicio = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusDays(3);
            }
            if (dataFim != null) {
                fim = LocalDateTime.ofInstant(sdf.parse(dataFim).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                fim = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(3);
            }

        } catch (ParseException e) {
            e.printStackTrace();
            // Handle exception as needed
        }

        RelatorioResponseDTO<RelatorioItemAFazerDTO> relatorioResponse = new RelatorioResponseDTO<RelatorioItemAFazerDTO>(
                inicio.toLocalDate(),
                fim.toLocalDate(),
                status,
                itemAFazerRepository.findRelatorioItensAFazer(inicio, fim, status));
        return relatorioResponse;
    }

    @Autowired
    private PecaRepository pecaRepository;

    public RelatorioResponseDTO<RelatorioPecaUtilizadaDTO> gerarRelatorioPecasUtilizadas() {

        RelatorioResponseDTO<RelatorioPecaUtilizadaDTO> relatorioResponse = new RelatorioResponseDTO<RelatorioPecaUtilizadaDTO>(
                null,
                null,
                null,
                pecaRepository.findRelatorioPecasUtilizadas());

        return relatorioResponse;
    }

    public RelatorioResponseDTO<RelatorioManutencaoConcluidaDTO> gerarRelatorioManutencoesConcluidas(String dataInicio,
            String dataFim) {
        LocalDateTime inicio = null;
        LocalDateTime fim = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            if (dataInicio != null) {
                inicio = LocalDateTime.ofInstant(sdf.parse(dataInicio).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                inicio = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusDays(3);
            }
            if (dataFim != null) {
                fim = LocalDateTime.ofInstant(sdf.parse(dataFim).toInstant(), java.time.ZoneId.systemDefault());
            } else {
                fim = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(3);
            }
        } catch (ParseException e) {
            e.printStackTrace();
            // Handle exception as needed
        }

        List<RelatorioManutencaoConcluidaDTO> manutencoesConcluidas = manutencaoRepository
                .findRelatorioManutencoesConcluidas(inicio, fim);
        return new RelatorioResponseDTO<>(inicio.toLocalDate(), fim.toLocalDate(), null, manutencoesConcluidas);
    }

    public HashMap<String, Object> gerarDashboard() {

        var statusServico = servicoRepository.findStatusCount();
        var itensAFazerStatus = itemAFazerRepository.findItensAFazerStatus();
        var itemAFazerTipo = itemAFazerRepository.findItensPorTipo();
        var tarefasMecanico = manutencaoRepository.findEficienciaMecanicos();
        var custoMedio = servicoRepository.findCustoMedioPorServico();
        var custoMedioMarcaVeiculo =  servicoRepository.findPrecoMedioPorMarca();
        var custoMedioVeiculo =  servicoRepository.findPrecoMedioPorVeiculo();
        var itensMaiorCusto = itemAFazerRepository.findItensComMaiorCusto();
        var custoMedioCliente = servicoRepository.findCustoMedioPorCliente();
        var custoMedioDosCliente = servicoRepository.findCustoMedioDosClientes();
        var custoMedioDasMarcas= servicoRepository.findCustoMedioDasMarcas();
        var custoMedioDosVeiculos = servicoRepository.findCustoMedioDosVeiculos();

        HashMap<String, Object> hash = new HashMap<>();

        hash.put("statusServico",statusServico); 
        hash.put("itensAFazerStatus",itensAFazerStatus); 
        hash.put("itemAFazerTipo", itemAFazerTipo); 
        hash.put("tarefasMecanico", tarefasMecanico); 
        hash.put("custoMedioMarcaVeiculo", custoMedioMarcaVeiculo); 
        hash.put("custoMedioVeiculo", custoMedioVeiculo); 
        hash.put("itensMaiorCusto", itensMaiorCusto); 
        hash.put("itensMaiorCusto", itensMaiorCusto); 
        hash.put("custoMedioCliente", custoMedioCliente); 
        hash.put("custoMedio", custoMedio); 
        hash.put("custoMedioDosCliente", custoMedioDosCliente); 
        hash.put("custoMedioDasMarcas", custoMedioDasMarcas); 
        hash.put("custoMedioDosVeiculos", custoMedioDosVeiculos); 


        return hash ;
    }
       
}