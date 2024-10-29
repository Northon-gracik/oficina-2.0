package com.oficina.backend.services;

import com.oficina.backend.entitities.*;
import com.oficina.backend.enums.*;
import com.oficina.backend.repositories.*;
import com.oficina.backend.util.MathServicoUtil;
import com.oficina.backend.util.ServicoValidateUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    @Autowired
    VehicleRepository vehicleRepository;

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

    /**
     * Agenda um serviço, criando um novo agendamento e um novo serviço com status
     * AGENDADO.
     * 
     * @param agendamento O agendamento a ser criado.
     * @return O serviço criado.
     */
    @Transactional
    public Servico agendarServico(Agendamento agendamento) {
        agendamento.setStatus(StatusAgendamento.CONFIRMADO);
        ServicoValidateUtil.validarAgendamento(agendamento);
        Agendamento savedAgendamento = agendamentoRepository.save(agendamento);
        Servico servico = new Servico();
        servico.setAgendamento(savedAgendamento);
        servico.setStatus(StatusServico.AGENDADO);
        servico.setStatusPagamento(StatusPagamento.PENDENTE);
        return servicoRepository.save(servico);
    }

    /**
     * Esta função agrega um serviço, criando um novo agendamento e um novo serviço
     * com status AGENDADO.
     * 
     * @param agendamento O agendamento a ser criado.
     * @return O serviço criado.
     * 
     *         Observações:
     *         - O agendamento deve ter data e hora de agendamento, status
     *         CONFIRMADO e descrição do problema.
     *         - O serviço criado terá o status AGENDADO e o agendamento criado como
     *         seu agendamento.
     *         - A inspeção de entrada e a manutenção ainda não foram realizadas.
     *         - O serviço ainda não tem um orçamento.
     *         - O serviço ainda não tem um veículo identificado.
     *         - O serviço ainda não tem um mecanico atribuído.
     *         - O serviço ainda não tem uma data de início ou de conclusão.
     *         - O serviço ainda não tem um tempo estimado.
     *         - O serviço ainda não tem um custo estimado.
     *         - O serviço ainda não tem um custo final.
     *         - O serviço ainda não tem uma forma de pagamento.
     *         - O serviço ainda não tem um status de pagamento.
     *         - O serviço ainda não tem um valor de pagamento.
     *         - O serviço ainda não tem uma entrega.
     *         - O serviço ainda não tem um histórico de notas.
     *         - O serviço ainda não tem um histórico de peças.
     *         - O serviço ainda não tem um histórico de manutenções.
     *         - O serviço ainda não tem um histórico de orçamentos.
     *         - O serviço ainda não tem um histórico de inspeções.
     *         - O serviço ainda não tem um histórico de entregas.
     * 
     *         Fluxo de desenvolvimento:
     *         - O frontend deve chamar esta função para criar um novo agendamento e
     *         um novo serviço.
     *         - Após a criação do serviço, o frontend deve chamar a função
     *         identificarVeiculo para identificar o veículo do serviço.
     *         - Após a identificação do veículo, o frontend deve chamar a função
     *         realizarInspecaoEntrada para realizar a inspeção de entrada do
     *         serviço.
     *         - Após a inspeção de entrada, o frontend deve chamar a função
     *         criarOrcamento para criar um orçamento para o serviço.
     *         - Após a criação do orçamento, o frontend deve chamar a função
     *         inserirItensOrcamento para inserir os itens do orçamento no serviço.
     *         - Após a inserção dos itens, o frontend deve chamar a função
     *         iniciarManutencao para iniciar a manutenção do serviço.
     *         - Após a manutenção, o frontend deve chamar a função
     *         realizarInspecaoSaida para realizar a inspeção de saída do serviço.
     *         - Após a inspeção de saída, o frontend deve chamar a função
     *         finalizarServico para finalizar o serviço.
     *         - Após a finalização do serviço, o frontend deve chamar a função
     *         registrarPagamento para registrar o pagamento do serviço.
     *         - Após o pagamento, o frontend deve chamar a função registrarEntrega
     *         para registrar a entrega do serviço.
     */
    /**
     * Identifica o veículo de um serviço.
     * 
     * @param servicoId O identificador do serviço.
     * @param vehicleId O identificador do veículo.
     * @return O serviço com o veículo identificado.
     */
    @Transactional
    public Servico identificarVeiculo(Long servicoId, Long vehicleId) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
        servico.setVehicle(vehicle);
        return servicoRepository.save(servico);
    }

    /**
     * Realiza a inspeção de entrada de um serviço.
     * - O serviço ainda não tem uma inspeção de entrada.
     * - O serviço ainda não tem um histórico de notas.
     * - O serviço ainda não tem um histórico de peças.
     * - O serviço ainda não tem um histórico de manutenções.
     * - O serviço ainda não tem um histórico de orçamentos.
     * - O serviço ainda não tem um histórico de inspeções.
     * - O serviço ainda não tem um histórico de entregas.
     * 
     * Fluxo de desenvolvimento:
     * - O frontend deve chamar esta função para criar um novo agendamento e um novo
     * serviço.
     * - Após a criação do serviço, o frontend deve chamar a função
     * identificarVeiculo para identificar o veículo do serviço.
     * - Após a identificação do veículo, o frontend deve chamar a função
     * realizarInspecaoEntrada para realizar a inspeção de entrada do serviço.
     * - Após a inspeção de entrada, o frontend deve chamar a função criarOrcamento
     * para criar um orçamento para o serviço.
     * - Após a criação do orçamento, o frontend deve chamar a função
     * inserirItensOrcamento para inserir os itens do orçamento no serviço.
     * - Após a inserção dos itens, o frontend deve chamar a função
     * iniciarManutencao para iniciar a manutenção do serviço.
     * - Após a manutenção, o frontend deve chamar a função realizarInspecaoSaida
     * para realizar a inspeção de saída do serviço.
     * - Após a inspeção de saída, o frontend deve chamar a função finalizarServico
     * para finalizar o serviço.
     * - Após a finalização do serviço, o frontend deve chamar a função
     * registrarPagamento para registrar o pagamento do serviço.
     * - Após o pagamento, o frontend deve chamar a função registrarEntrega para
     * registrar a entrega do serviço.
     */

    @Transactional
    public Servico realizarInspecaoEntrada(Long servicoId, Inspecao inspecao) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGENDADO) {
            throw new IllegalStateException(
                    "A inspeção de entrada só pode ser realizada se o serviço estiver AGENDADO");
        }
        if (servico.getInspecaoEntrada() != null) {
            throw new IllegalStateException("Já existe uma inspeção de entrada para este serviço");
        }
        inspecao.setDataInspecao(new Date());
        ServicoValidateUtil.validarInspecao(inspecao);
        inspecao.setChecklistInspecao(inspecao.getChecklistInspecao());
        Inspecao inspecaoSaved = inspecaoRepository.save(inspecao);
        servico.setInspecaoEntrada(inspecaoSaved);
        servico.setDataInicio(new Date());
        servico.setStatus(StatusServico.AGUARDANDO_ORCAMENTO);
        ServicoValidateUtil.validarServico(servico);
        return servicoRepository.save(servico);
    }

    /**
     * Fluxo de desenvolvimento:
     * - O frontend deve chamar a função agendarServico para criar um novo
     * agendamento e um novo serviço.
     * - Após a criação do serviço, o frontend deve chamar a função
     * identificarVeiculo para identificar o veículo do serviço.
     * - Após a identificação do veículo, o frontend deve chamar a função
     * realizarInspecaoEntrada para realizar a inspeção de entrada do serviço.
     * - Após a inspeção de entrada, o frontend deve chamar a função criarOrcamento
     * para criar um orçamento para o serviço.
     * - Após a criação do orçamento, o frontend deve chamar a função
     * inserirItensOrcamento para inserir os itens do orçamento no serviço.
     * - Após a inserção dos itens, o frontend deve chamar a função
     * iniciarManutencao para iniciar a manutenção do serviço.
     * - Após a manutenção, o frontend deve chamar a função realizarInspecaoSaida
     * para realizar a inspeção de saída do serviço.
     * - Após a inspeção de saída, o frontend deve chamar a função finalizarServico
     * para finalizar o serviço.
     * - Após a finalização do serviço, o frontend deve chamar a função
     * registrarPagamento para registrar o pagamento do serviço.
     * - Após o pagamento, o frontend deve chamar a função registrarEntrega para
     * registrar a entrega do serviço.
     */

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
        orcamento.setDataCriacao(new Date());
        orcamento.setStatus(StatusOrcamento.PENDENTE);
        // orcamento.setCustoTotalEstimado(MathUtil.calcularCustoTotalEstimado(orcamento.getItensAFazer()));
        ServicoValidateUtil.validateOrcamento(orcamento);
        Orcamento orcamentoSaved = orcamentoRepository.save(orcamento);
        servico.setOrcamento(orcamentoSaved);
        // servico.setCustoEstimado(BigDecimal.valueOf(orcamentoSaved.getCustoTotalEstimado()));
        servico.setStatus(StatusServico.PENDENTE);
        return servicoRepository.save(servico);
    }

    /**
     * Fluxo de desenvolvimento:
     * - O frontend deve chamar a função agendarServico para criar um novo
     * agendamento e um novo serviço.
     * - Após a criação do serviço, o frontend deve chamar a função
     * identificarVeiculo para identificar o veículo do serviço.
     * - Após a identificação do veículo, o frontend deve chamar a função
     * realizarInspecaoEntrada para realizar a inspeção de entrada do serviço.
     * - Após a inspeção de entrada, o frontend deve chamar a função criarOrcamento
     * para criar um orçamento para o serviço.
     * - Após a criação do orçamento, o frontend deve chamar a função
     * inserirItensOrcamento para inserir os itens do orçamento no serviço.
     * - Após a inserção dos itens, o frontend deve chamar a função
     * iniciarManutencao para iniciar a manutenção do serviço.
     * - Após a manutenção, o frontend deve chamar a função realizarInspecaoSaida
     * para realizar a inspeção de saída do serviço.
     * - Após a inspeção de saída, o frontend deve chamar a função finalizarServico
     * para finalizar o serviço.
     * - Após a finalização do serviço, o frontend deve chamar a função
     * registrarPagamento para registrar o pagamento do serviço.
     * - Após o pagamento, o frontend deve chamar a função registrarEntrega para
     * registrar a entrega do serviço.
     */
    @Transactional
    public Servico inserirItensOrcamento(Long servicoId, ItemAFazer item) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getOrcamento() == null) {
            throw new RuntimeException("Orcamento ainda não criado");
        }
        if (servico.getStatus() != StatusServico.PENDENTE) {
            throw new IllegalStateException("O item do orçamento só pode ser inserido se o serviço estiver PENDENTE");
        }
        item.setStatusManutencao(StatusManutencao.PENDENTE);
        item.setOrcamento(servico.getOrcamento());
        ServicoValidateUtil.validateItemAFazer(item);
        itensAFazerRepository.save(item);
        return servicoRepository.save(MathServicoUtil.calcularValoresEstimadoServico(servico));
    }

    /**
     * Fluxo de desenvolvimento:
     * - O frontend deve chamar a função agendarServico para criar um novo
     * agendamento e um novo serviço.
     * - Após a criação do serviço, o frontend deve chamar a função
     * identificarVeiculo para identificar o veículo do serviço.
     * - Após a identificação do veículo, o frontend deve chamar a função
     * realizarInspecaoEntrada para realizar a inspeção de entrada do serviço.
     * - Após a inspeção de entrada, o frontend deve chamar a função criarOrcamento
     * para criar um orçamento para o serviço.
     * - Após a criação do orçamento, o frontend deve chamar a função
     * inserirItensOrcamento para inserir os itens do orçamento no serviço.
     * - Após a inserção dos itens, o frontend deve chamar a função
     * iniciarManutencao para iniciar a manutenção do serviço.
     * - Após a manutenção, o frontend deve chamar a função realizarInspecaoSaida
     * para realizar a inspeção de saída do serviço.
     * - Após a inspeção de saída, o frontend deve chamar a função finalizarServico
     * para finalizar o serviço.
     * - Após a finalização do serviço, o frontend deve chamar a função
     * registrarPagamento para registrar o pagamento do serviço.
     * - Após o pagamento, o frontend deve chamar a função registrarEntrega para
     * registrar a entrega do serviço.
     */
    @Transactional
    public Servico inserirPecaItemOrcamento(Long servicoId, Long itemId, Peca peca) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        Orcamento orcamento = servico.getOrcamento();
        if (orcamento == null) {
            throw new RuntimeException("Orcamento ainda não criado");
        }
        ItemAFazer item = orcamento.getItensAFazer().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item não encontrado no orçamento do serviço"));
        ServicoValidateUtil.validatePeca(peca);
        peca.setItemAFazer(item);
        pecaRepository.save(peca);
        return servicoRepository.save(MathServicoUtil.calcularValoresEstimadoServico(servico));
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
        manutencao.setDataInicio(new Date());
        ServicoValidateUtil.validateManutencao(manutencao);
        for (ItemAFazer item : servico.getOrcamento().getItensAFazer()) {
            item.setManutencao(manutencao);
            itensAFazerRepository.save(item);
        }
        manutencao = manutencaoRepository.save(manutencao);
        servico.setManutencao(manutencao);
        servico.setStatus(StatusServico.EM_ANDAMENTO);

        return servicoRepository.save(MathServicoUtil.calcularCustoFinal(servico));
    }

    @Transactional
    public Servico inserirItensManutencao(Long servicoId, ItemAFazer item) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getManutencao() == null) {
            throw new RuntimeException("Manutencao ainda não criada");
        }
        item.setStatusManutencao(StatusManutencao.PENDENTE);
        ServicoValidateUtil.validateItemAFazer(item);
        item.setManutencao(servico.getManutencao());
        itensAFazerRepository.save(item);
        return servicoRepository.save(MathServicoUtil.calcularCustoFinal(servico));
    }

    @Transactional
    public Servico inserirPecaItemManutencao(Long servicoId, Long itemId, Peca peca) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        Manutencao manutencao = servico.getManutencao();
        if (manutencao == null) {
            throw new RuntimeException("Manutenção ainda não criada");
        }
        ItemAFazer item = manutencao.getItensAFazer().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item não encontrado na manutenção do serviço"));

        ServicoValidateUtil.validatePeca(peca);
        peca.setItemAFazer(item);
        pecaRepository.save(peca);
        return servicoRepository.save(MathServicoUtil.calcularCustoFinal(servico));
    }

    @Transactional
    public ItemAFazer mudarStatusItem(Long itemId, StatusManutencao statusItem) {
        if (statusItem == null) {
            throw new RuntimeException("Status do item nao pode ser nulo!");
        }
        return itensAFazerRepository.findById(itemId)
                .map(item -> {
                    if (item.getStatusManutencao() == statusItem) {
                        throw new RuntimeException("O status do item não pode ser alterado para o mesmo status atual!");
                    } else if (statusItem == StatusManutencao.EM_ANDAMENTO) {
                        item.setHoraInicio(new Date());
                    } else if (statusItem == StatusManutencao.CONCLUIDA) {
                        item.setHoraFim(new Date());
                    }
                    item.setStatusManutencao(statusItem);
                    if (statusItem == StatusManutencao.CANCELADA) {
                        Servico servico = servicoRepository.findByManutencaoId(item.getManutencao().getId());

                        servicoRepository.save(MathServicoUtil.calcularCustoFinal(servico));
                    }
                    return itensAFazerRepository.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Item não encontrado!"));
    }

    @Transactional
    public Servico finalizarManutencao(Long servicoId) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.EM_ANDAMENTO) {
            throw new IllegalStateException("A manutenção só pode ser finalizada se o serviço estiver EM_ANDAMENTO");
        }
        Manutencao manutencao = servico.getManutencao();
        if (manutencao.getItensAFazer().stream()
                .noneMatch(i -> i.getStatusManutencao() == StatusManutencao.CONCLUIDA
                        || i.getStatusManutencao() == StatusManutencao.CANCELADA)) {
            throw new IllegalStateException(
                    "Todos os itens devem estar concluídos ou cancelados para finalizar a manutenção");
        }
        manutencao.setDataConclusao(new Date());
        ServicoValidateUtil.validateManutencao(manutencao);
        manutencao = manutencaoRepository.save(manutencao);
        servico.setManutencao(manutencao);
        servico.setStatus(StatusServico.AGUARDANDO_INSPECAO_FINAL);
        return servicoRepository.save(MathServicoUtil.calcularCustoFinal(servico));
    }

    @Transactional
    public Servico realizarInspecaoSaida(Long servicoId, Inspecao inspecao) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        if (servico.getStatus() != StatusServico.AGUARDANDO_INSPECAO_FINAL) {
            throw new IllegalStateException(
                    "A inspeção de saída só pode ser realizada se o serviço estiver AGUARDANDO_INSPECAO_FINAL");
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
    public Servico registrarPagamento(Long servicoId, BigDecimal valorPagamento) {
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        if (servico.getStatus() != StatusServico.AGUARDANDO_ENTREGA) {
            throw new IllegalStateException(
                    "O pagamento só pode ser registrado se o serviço estiver AGUARDANDO_ENTREGA");
        }

        BigDecimal valorTotal = servico.getCustoFinal();
        BigDecimal valorPagamentoTotal = valorPagamento;
        if (servico.getValorPagamento() != null) {
            valorPagamentoTotal = servico.getValorPagamento().add(valorPagamento);
        }

        if (valorPagamentoTotal.compareTo(valorTotal) > 0) {
            throw new IllegalStateException("O valor de pagamento não pode ser maior que o valor total do serviço");
        }

        servico.setValorPagamento(valorPagamentoTotal);
        servico.setStatusPagamento(valorPagamentoTotal.compareTo(valorTotal) >= 0
                ? StatusPagamento.PAGO_TOTALMENTE
                : StatusPagamento.PAGO_PARCIALMENTE);

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
        if (servico.getStatusPagamento() != StatusPagamento.PAGO_TOTALMENTE) {
            throw new IllegalStateException("O pagamento do serviço deve ser concluído antes de finalizar o serviço");
        }
        entrega.setDataEntrega(new Date());
        ServicoValidateUtil.validateEntrega(entrega);
        Entrega entregaSaved = entregaRepository.save(entrega);
        servico.setStatus(StatusServico.FINALIZADO);
        servico.setDataConclusao(new Date());
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

    public Optional<ItemAFazer> findItemById(Long itemId) {
        return itensAFazerRepository.findById(itemId);
    }

}
