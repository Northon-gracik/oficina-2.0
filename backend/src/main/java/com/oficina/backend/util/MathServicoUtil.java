package com.oficina.backend.util;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.oficina.backend.entitities.ItemAFazer;
import com.oficina.backend.entitities.Servico;
import com.oficina.backend.enums.StatusManutencao;

public class MathServicoUtil {

    public static BigDecimal calcularCustoDosItens(List<ItemAFazer> itensAFazer) {
        return itensAFazer.stream()
                .map(item -> {
                    BigDecimal valorTotalPecas = calcularValorTotalPecas(item);
                    item.setValorTotalPecas(valorTotalPecas);
                    return valorTotalPecas.add(item.getValorMaoDeObra());
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Fun o auxiliar para calcular o valor total das pe as
    private static BigDecimal calcularValorTotalPecas(ItemAFazer itemAFazer) {
        return itemAFazer.getPecas().stream()
                .map(peca -> peca.getValorUnitario().multiply(BigDecimal.valueOf(peca.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public static Servico calcularValoresEstimadoServico(Servico servico) {
        servico.getOrcamento().setCustoTotalEstimado(MathServicoUtil.calcularCustoDosItens(servico.getOrcamento().getItensAFazer()));
        servico.setCustoEstimado(servico.getOrcamento().getCustoTotalEstimado());
        return servico;
    }

    
    public static Servico calcularCustoFinal(Servico servico) {
        List<ItemAFazer> itensAFazerNaoCancelados = servico.getManutencao().getItensAFazer().stream()
                .filter(item -> item.getStatusManutencao() != StatusManutencao.CANCELADA)
                .toList();
        servico.getManutencao().setCustosReais(MathServicoUtil.calcularCustoDosItens(itensAFazerNaoCancelados));
        servico.setCustoFinal(servico.getOrcamento().getCustoTotalEstimado());
        return servico;
    }
}
