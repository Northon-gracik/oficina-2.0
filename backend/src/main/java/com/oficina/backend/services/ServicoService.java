package com.oficina.backend.services;

import com.oficina.backend.entitities.*;
import com.oficina.backend.enums.*;
import com.oficina.backend.repositories.*;
import com.oficina.backend.util.MathServicoUtil;
import com.oficina.backend.util.ServicoValidateUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    @Autowired VehicleRepository vehicleRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private InspecaoRepository inspecaoRepository;

    @Autowired
    private OrcamentoRepository orcamentoRepository;

    @Autowired
    private ItemAFazerRepository itensAFazerRepository;

    @Autowired
    private PecaRepository pecaRepository;

    @Autowired
    private ManutencaoRepository manutencaoRepository;

    @Autowired
    private EntregaRepository entregaRepository;

    @Transactional
    public Servico agendarServico(Agendamento agendamento) {
        agendamento.setStatus(StatusAgendamento.CONFIRMADO);
        ServicoValidateUtil.validarAgendamento(agendamento);
        Agendamento savedAgendamento = agendamentoRepository.save(agendamento);
        Servico servico = new Servico();
        servico.setAgendamento(savedAgendamento);
        servico.setStatus(StatusServico.AGENDADO);
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico identificarVeiculo(Long servicoId, Long vehicleId){
        Servico servico = servicoRepository.findById(servicoId)
            .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
        servico.setVehicle(vehicle);
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico realizarInspecaoEntrada(Long servicoId, Inspecao inspecao) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGENDADO) {
            throw new IllegalStateException("A inspeção de entrada só pode ser realizada se o serviço estiver AGENDADO");
        }
        if (servico.getInspecaoEntrada() != null) {
            throw new IllegalStateException("Já existe uma inspeção de entrada para este serviço");
        }
        ServicoValidateUtil.validarInspecao(inspecao);
        inspecao.setChecklistInspecao(inspecao.getChecklistInspecao());
        Inspecao inspecaoSaved = inspecaoRepository.save(inspecao);
        servico.setInspecaoEntrada(inspecaoSaved);
        servico.setDataInicio(LocalDateTime.now());
        servico.setStatus(StatusServico.AGUARDANDO_ORCAMENTO);
        ServicoValidateUtil.validarServico(servico);
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico criarOrcamento(Long servicoId, Orcamento orcamento) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGUARDANDO_ORCAMENTO) {
            throw new IllegalStateException("O orçamento só pode ser criado se o serviço estiver AGUARDANDO_ORCAMENTO");
        }
        if (servico.getOrcamento() != null) {
            throw new IllegalStateException("Já existe um orçamento para este serviço");
        }
        orcamento.setDataCriacao(LocalDateTime.now());
        // orcamento.setCustoTotalEstimado(MathUtil.calcularCustoTotalEstimado(orcamento.getItensAFazer()));
        ServicoValidateUtil.validateOrcamento(orcamento);
        Orcamento orcamentoSaved = orcamentoRepository.save(orcamento);
        servico.setOrcamento(orcamentoSaved);
        // servico.setCustoEstimado(BigDecimal.valueOf(orcamentoSaved.getCustoTotalEstimado()));
        servico.setStatus(StatusServico.PENDENTE);
        return servicoRepository.save(servico);
    }

    @Transactional 
    public Servico inserirItensOrcamento(Long servicoId, ItemAFazer item) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if(servico.getOrcamento() == null) {
            throw new RuntimeException("Orcamento ainda não criado");
        }
        ServicoValidateUtil.validateItemAFazer(item);
        item.setOrcamento(servico.getOrcamento());
        itensAFazerRepository.save(item);
        return servicoRepository.save(MathServicoUtil.calcularValoresServico(servico));
    }    
    @Transactional 
    public Servico inserirPecaItem(Long servicoId, Long itemId, Peca peca) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getOrcamento() == null) {
            throw new RuntimeException("Orcamento ainda não criado");
        }
        ItemAFazer item = servico.getOrcamento().getItensAFazer().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item não encontrado no orçamento do serviço"));
        peca.setItemAFazer(item);
        pecaRepository.save(peca);
        return servicoRepository.save(MathServicoUtil.calcularValoresServico(servico));
    }

    @Transactional
    public Servico iniciarManutencao(Long servicoId, Manutencao manutencao) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.PENDENTE) {
            throw new IllegalStateException("A manutenção só pode ser iniciada se o serviço estiver PENDENTE");
        }
        if (servico.getManutencao() != null) {
            throw new IllegalStateException("Já existe uma manutenção para este serviço");
        }
        manutencao.setDataInicio(LocalDateTime.now());
        ServicoValidateUtil.validateManutencao(manutencao);
        for (ItemAFazer item : servico.getOrcamento().getItensAFazer()){
            item.setManutencao(manutencao);
            itensAFazerRepository.save(item);
        }
        manutencao = manutencaoRepository.save(manutencao);
        servico.setManutencao(manutencao);
        servico.setStatus(StatusServico.EM_ANDAMENTO);
        return servicoRepository.save(servico);
    }


    @Transactional
    public ItemAFazer mudarStatusItem(Long itemId, StatusManutencao statusItem) {
        return itensAFazerRepository.findById(itemId)
                .map(item -> {
                    item.setStatusManutencao(statusItem);
                    return itensAFazerRepository.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));
    }

    @Transactional
    public Servico finalizarManutencao(Long servicoId) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.EM_ANDAMENTO) {
            throw new IllegalStateException("A manutenção só pode ser finalizada se o serviço estiver EM_ANDAMENTO");
        }
        if (servico.getManutencao().getItensAFazer().stream()
                .noneMatch(i -> i.getStatusManutencao() == StatusManutencao.CONCLUIDA || i.getStatusManutencao() == StatusManutencao.CANCELADA)) {
            throw new IllegalStateException("Todos os itens devem estar concluídos ou cancelados para finalizar a manutenção");
        }

        Manutencao manutencao = servico.getManutencao();

        manutencao.setDataConclusao(LocalDateTime.now());
        ServicoValidateUtil.validateManutencao(manutencao);
        manutencao = manutencaoRepository.save(manutencao);
        servico.setManutencao(manutencao);
        servico.setCustoFinal(MathServicoUtil.calcularCustoFinal(servico));
        servico.setStatus(StatusServico.AGUARDANDO_INSPECAO_FINAL);
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico realizarInspecaoSaida(Long servicoId, Inspecao inspecao) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGUARDANDO_INSPECAO_FINAL) {
            throw new IllegalStateException("A inspeção de saída só pode ser realizada se o serviço estiver AGUARDANDO_INSPECAO_FINAL");
        }
        if (servico.getInspecaoSaida() != null) {
            throw new IllegalStateException("Já existe uma inspeção de saída para este serviço");
        }
        ServicoValidateUtil.validarInspecao(inspecao);
        inspecao.setChecklistInspecao(inspecao.getChecklistInspecao());
        Inspecao inspecaoSaved = inspecaoRepository.save(inspecao);
        servico.setInspecaoSaida(inspecaoSaved);
        servico.setStatus(StatusServico.AGUARDANDO_ENTREGA);
        return servicoRepository.save(servico);
    }

    @Transactional
    public Servico finalizarServico(Long servicoId, Entrega entrega) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGUARDANDO_ENTREGA) {
            throw new IllegalStateException("O serviço só pode ser finalizado se estiver AGUARDANDO_ENTREGA");
        }
        if (servico.getInspecaoSaida() == null) {
            throw new IllegalStateException("A inspeção de saída deve ser realizada antes de finalizar o serviço");
        }
        entrega.setDataEntrega(LocalDateTime.now());
        ServicoValidateUtil.validateEntrega(entrega);
        Entrega entregaSaved = entregaRepository.save(entrega);
        servico.setStatus(StatusServico.FINALIZADO);
        servico.setDataConclusao(LocalDateTime.now());
        servico.setEntrega(entregaSaved);
        return servicoRepository.save(servico);
    }


    public List<Servico> listarTodosServicos() {
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscarServicoPorId(Long id) {
        return servicoRepository.findById(id);
    }

    public List<String> getListItemInspecao() {
        return Inspecao.FIXED_ITEMS.keySet().stream().collect(Collectors.toList());
    }

}
