package com.oficina.backend.util;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.oficina.backend.entitities.ItemAFazer;
import com.oficina.backend.entitities.Servico;

public class MathServicoUtil {

    public static double calcularCustoTotalEstimado(List<ItemAFazer> itensAFazer) {
        return itensAFazer.stream()
                .mapToDouble(item -> {
                    double valorTotalPecas = calcularValorTotalPecas(item);
                    item.setValorTotalPecas(valorTotalPecas);
                    return valorTotalPecas + item.getValorMaoDeObra();
                })
                .sum();
    }

    // Função auxiliar para calcular o valor total das peças
    private static double calcularValorTotalPecas(ItemAFazer itemAFazer) {
        return itemAFazer.getPecas().stream()
                .mapToDouble(peca -> peca.getValorUnitario() * peca.getQuantidade())
                .sum();
    }

    @Transactional
    public static Servico calcularValoresServico(Servico servico) {
        servico.getOrcamento().setCustoTotalEstimado(MathServicoUtil.calcularCustoTotalEstimado(servico.getOrcamento().getItensAFazer()));
        servico.setCustoEstimado(BigDecimal.valueOf(servico.getOrcamento().getCustoTotalEstimado()));
        return servico;
    }

    
    public static BigDecimal calcularCustoFinal(Servico servico) {
        return servico.getManutencao().getItensAFazer().stream()
                .map(item -> BigDecimal.valueOf(item.getValorMaoDeObra()).add(
                        item.getPecas().stream()
                                .map(peca -> BigDecimal.valueOf(peca.getValorUnitario() * peca.getQuantidade()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
