package com.oficina.backend.util;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.mapping.Map;

import com.oficina.backend.entitities.Agendamento;
import com.oficina.backend.entitities.Entrega;
import com.oficina.backend.entitities.Inspecao;
import com.oficina.backend.entitities.Orcamento;
import com.oficina.backend.entitities.Peca;
import com.oficina.backend.entitities.Servico;
import com.oficina.backend.entitities.ItemAFazer;
import com.oficina.backend.entitities.Manutencao;
import com.oficina.backend.enums.StatusServico;

public class ServicoValidateUtil {
    /**
     * Valida se o agendamento está correto.
     * 
     * Verifica se a data do agendamento é futura, se a descrição do problema
     * é diferente de nula e tem pelo menos 10 caracteres, e se o status do
     * agendamento é diferente de nulo.
     * 
     * @param agendamento Agendamento a ser validado.
     * @throws IllegalArgumentException Caso o agendamento esteja inválido.
     */
    public static void validarAgendamento(Agendamento agendamento) {
        if (agendamento.getDataAgendamento() == null
                || agendamento.getDataAgendamento().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A data do agendamento deve ser futura.");
        }

        if (agendamento.getDescricaoProblema() == null || agendamento.getDescricaoProblema().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição do problema é obrigatória.");
        }

        if (agendamento.getDescricaoProblema().length() < 10) {
            throw new IllegalArgumentException("A descrição do problema deve ter no mínimo 10 caracteres.");
        }

        if (agendamento.getStatus() == null) {
            throw new IllegalArgumentException("O status do agendamento é obrigatório.");
        }

        // Outras validações, se necessário
    }

    public static void validarServico(Servico servico) {
        if (servico.getVehicle() == null) {
            throw new IllegalArgumentException("O veículo é obrigatório.");
        }

        // if (servico.getMecanico() == null) {
        // throw new IllegalArgumentException("O mecânico é obrigatório.");
        // }

        if (servico.getDataInicio() == null) {
            throw new IllegalArgumentException("A data de início é obrigatória.");
        }

        if (servico.getDataConclusao() != null && servico.getDataInicio().after(servico.getDataConclusao())) {
            throw new IllegalArgumentException("A data de início não pode ser posterior à data de conclusão.");
        }

        if (servico.getCustoEstimado() != null && servico.getCustoEstimado().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O custo estimado não pode ser negativo.");
        }

        if (servico.getCustoFinal() != null && servico.getCustoFinal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O custo final não pode ser negativo.");
        }

        if (servico.getTempoEstimado() != null && servico.getTempoEstimado().toMinutes() < 0) {
            throw new IllegalArgumentException("O tempo estimado não pode ser negativo.");
        }

        if (servico.getTempoReal() != null && servico.getTempoReal().toMinutes() < 0) {
            throw new IllegalArgumentException("O tempo real não pode ser negativo.");
        }

        if (servico.getStatus() == StatusServico.FINALIZADO) {
            if (servico.getFormaPagamento() == null || servico.getStatusPagamento() == null) {
                throw new IllegalArgumentException(
                        "Forma de pagamento e status do pagamento são obrigatórios quando o serviço está concluído.");
            }
        }

        // Outras validações, se necessário
    }

    public static void validarInspecao(Inspecao inspecao) {
        if (inspecao.getDataInspecao() == null || inspecao.getDataInspecao().after(new Date())) {
            throw new IllegalArgumentException("A data da inspeção deve ser válida e não pode ser no futuro.");
        }

        if (inspecao.getResponsavelInspecao() == null || inspecao.getResponsavelInspecao().trim().isEmpty()) {
            throw new IllegalArgumentException("O responsável pela inspeção é obrigatório.");
        }

        if (inspecao.getQuilometragem() == null || inspecao.getQuilometragem().trim().isEmpty()) {
            throw new IllegalArgumentException("A quilometragem é obrigatória.");
        }

        // if (inspecao.getChecklistInspecao() == null ||
        // inspecao.getChecklistInspecao().isEmpty()) {
        // throw new IllegalArgumentException("O checklist de inspeção é obrigatório.");
        // }

        if (inspecao.getNivelCombustivel() < 0 || inspecao.getNivelCombustivel() > 100) {
            throw new IllegalArgumentException("O nível de combustível deve estar entre 0 e 100.");
        }

        // Outras validações específicas podem ser adicionadas conforme necessário

        ServicoValidateUtil.validarChecklist(inspecao.getChecklistInspecao());
    }

    // Método para validar o checklist
    private static void validarChecklist(java.util.Map<String, Boolean> checklist) {
        // Verifica se todos os itens do checklist obrigatório estão presentes
        for (String item : Inspecao.getFIXED_ITEMS().keySet()) {
            if (!checklist.containsKey(item)) {
                throw new IllegalArgumentException("O item '" + item + "' está faltando no checklist.");
            }
        }

        // Caso queira validar um valor específico de um item, você pode fazer algo
        // como:
        // if (!checklist.get("freios")) {
        // throw new IllegalArgumentException("O item 'freios' deve estar presente no
        // checklist.");
        // }

        // Outras validações personalizadas...
    }


    public static void validateOrcamento(Orcamento orcamento) {
        if (orcamento == null) {
            throw new IllegalArgumentException("O orçamento não pode ser nulo.");
        }

        // Validações de data
        if (orcamento.getDataCriacao() == null) {
            throw new IllegalArgumentException("A data de criação é obrigatória.");
        }

        if (orcamento.getDataPrevista() != null && orcamento.getDataPrevista().after(new Date())) {
            throw new IllegalArgumentException("A data prevista deve ser no futuro ou presente.");
        }

        if (orcamento.getDataValidade() != null && orcamento.getDataValidade().after(new Date())) {
            throw new IllegalArgumentException("A data de validade deve ser no futuro.");
        }

        // Validação de status
        if (orcamento.getStatus() == null) {
            throw new IllegalArgumentException("O status do orçamento é obrigatório.");
        }

        // Validação de responsável pela emissão
        if (orcamento.getResponsavelEmissao() == null || orcamento.getResponsavelEmissao().trim().isEmpty()) {
            throw new IllegalArgumentException("O responsável pela emissão não pode estar vazio.");
        }
    }

    public static void validateItemAFazer(ItemAFazer itemAFazer) {
        if (itemAFazer == null) {
            throw new IllegalArgumentException("O item a fazer não pode ser nulo.");
        }

        // Validação de descrição
        if (itemAFazer.getDescricao() == null || itemAFazer.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição do item a fazer é obrigatória.");
        }

        // Validação de tipo de mecânico
        if (itemAFazer.getTipoMecanico() == null) {
            throw new IllegalArgumentException("O tipo de mecânico é obrigatório.");
        }

        // Validação de status de manutenção
        if (itemAFazer.getStatusManutencao() == null) {
            throw new IllegalArgumentException("O status da manutenção é obrigatório.");
        }

        // Validação de tipo de manutenção
        if (itemAFazer.getTipoManutencao() == null) {
            throw new IllegalArgumentException("O tipo de manutenção é obrigatório.");
        }
        if (itemAFazer.getTempoEstimado() == null || itemAFazer.getTempoEstimado().isNegative()
                || itemAFazer.getTempoEstimado().isZero()) {
            throw new IllegalArgumentException("O tempo estimado deve ser um valor positivo.");
        }

        // Validação de valor total de peças
        // if (itemAFazer.getValorTotalPecas() == null || itemAFazer.getValorTotalPecas().signum() < 0) {
        //     throw new IllegalArgumentException("O valor total das peças é obrigatório e não pode ser negativo.");
        // }

        // Validação de valor da mão de obra
        if (itemAFazer.getValorMaoDeObra() == null || itemAFazer.getValorMaoDeObra().signum() < 0) {
            throw new IllegalArgumentException("O valor da mão de obra é obrigatório e não pode ser negativo.");
        }
        // Validação da lista de peças
        // if (itemAFazer.getPeca() == null || itemAFazer.getPeca().isEmpty()) {
        //     throw new IllegalArgumentException("A lista de peças não pode estar vazia.");
        // }

        // for(Peca peca : itemAFazer.getPeca()) {
        //     validatePeca(peca);
        // }
    }

    public static void validatePeca(Peca peca) {
        if (peca == null) {
            throw new IllegalArgumentException("A peça não pode ser nula.");
        }

        // Validação de nome
        if (peca.getNome() == null || peca.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da peça é obrigatório.");
        }

        // Validação de descrição
        if (peca.getDescricao() == null || peca.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição da peça é obrigatória.");
        }

        // Validação de valor unitário
        if (peca.getValorUnitario() == null || peca.getValorUnitario().signum() < 0) {
            throw new IllegalArgumentException("O valor unitário da peça é obrigatório e não pode ser negativo.");
        }

        // Validação de quantidade
        if (peca.getQuantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade da peça deve ser maior que zero.");
        }

        // Validação de part number
        if (peca.getPartNumber() == null || peca.getPartNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("O número de peça (part number) é obrigatório.");
        }
    }

        public static void validateManutencao(Manutencao manutencao) {
        if (manutencao == null) {
            throw new IllegalArgumentException("A manutenção não pode ser nula.");
        }

        if (manutencao.getDataInicio() == null) {
            throw new IllegalArgumentException("A data de início não pode ser nula.");
        }

        if (manutencao.getDataConclusao() != null && manutencao.getDataConclusao().before(manutencao.getDataInicio())) {
            throw new IllegalArgumentException("A data de conclusão não pode ser anterior à data de início.");
        }

        if (manutencao.getDescricaoDetalhada() == null || manutencao.getDescricaoDetalhada().isEmpty()) {
            throw new IllegalArgumentException("A descrição detalhada não pode ser nula ou vazia.");
        }

        // if (manutencao.getCustosReais() == null || manutencao.getCustosReais().signum() < 0) {
        //     throw new IllegalArgumentException("Os custos reais são obrigatórios e não podem ser negativos.");
        // }

        if (manutencao.getTecnicoResponsavel() == null || manutencao.getTecnicoResponsavel().isEmpty()) {
            throw new IllegalArgumentException("O nome do técnico responsável não pode ser nulo ou vazio.");
        }

        // if (manutencao.getItensAFazer() == null || manutencao.getItensAFazer().isEmpty()) {
        //     throw new IllegalArgumentException("A lista de itens a fazer não pode ser nula ou vazia.");
        // }
    }
    public static void validateEntrega(Entrega entrega) {
        if (entrega == null) {
            throw new IllegalArgumentException("A entrega não pode ser nula.");
        }
        
        if (entrega.getResponsavelEntrega() == null || entrega.getResponsavelEntrega().isEmpty()) {
            throw new IllegalArgumentException("O responsável pela entrega não pode ser vazio.");
        }
        
        if (entrega.getDataEntrega() == null) {
            throw new IllegalArgumentException("A data de entrega não pode ser nula.");
        }
        
        if (entrega.getQuilometragemEntrega() <= 0) {
            throw new IllegalArgumentException("A quilometragem de entrega deve ser maior que zero.");
        }
        
        if (entrega.getObservacoesEntrega() != null && entrega.getObservacoesEntrega().length() > 500) {
            throw new IllegalArgumentException("As observações da entrega não podem exceder 500 caracteres.");
        }
    }
}
