package com.oficina.backend.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oficina.backend.dto.RelatorioItemAFazerDTO;
import com.oficina.backend.dto.RelatorioManutencaoConcluidaDTO;
import com.oficina.backend.dto.RelatorioPecaUtilizadaDTO;
import com.oficina.backend.dto.RelatorioResponseDTO;
import com.oficina.backend.dto.RelatorioServicoDTO;
import com.oficina.backend.enums.StatusManutencao;
import com.oficina.backend.enums.StatusServico;
import com.oficina.backend.services.RelatorioService;
import com.oficina.backend.util.ErrorUtil;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/servicos")
    public ResponseEntity<?> relatorioServicos(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) StatusServico status) {
        try {
            RelatorioResponseDTO<RelatorioServicoDTO> relatorioResponse = relatorioService
                    .gerarRelatorioServicos(dataInicio, dataFim, status);
            return ResponseEntity.ok(relatorioResponse);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao gerar relatório de serviços", e,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/itens")
    public ResponseEntity<?> gerarRelatorioItensAFazer(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) StatusManutencao status) {
        try {
            RelatorioResponseDTO<RelatorioItemAFazerDTO> relatorioResponse = relatorioService
                    .gerarRelatorioItensAFazer(dataInicio, dataFim, status);
            return ResponseEntity.ok(relatorioResponse);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao gerar relatório de itens à fazer", e,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping("/pecas")
    public ResponseEntity<?> gerarRelatorioPecasUtilizadas() {
        try {
            RelatorioResponseDTO<RelatorioPecaUtilizadaDTO> relatorioResponse = relatorioService
                    .gerarRelatorioPecasUtilizadas();
            return ResponseEntity.ok(relatorioResponse);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao gerar relatório de peças utilizadas", e,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping("/manutencoes")
    public ResponseEntity<?> gerarRelatorioManutencoesConcluidas(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        try {
            RelatorioResponseDTO<RelatorioManutencaoConcluidaDTO> relatorioResponse = relatorioService
                    .gerarRelatorioManutencoesConcluidas(dataInicio, dataFim);
            return ResponseEntity.ok(relatorioResponse);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao gerar relatório de manutenções concluídas", e,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> gerarRelatorioDashboard(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {
        try {
            HashMap<String, Object> relatorioResponse = relatorioService
                    .gerarDashboard();
            return ResponseEntity.ok(relatorioResponse);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao gerar relatório de dashboard", e,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
