package com.oficina.backend.dto;

public class CumprimentoPrazoDTO {
    private Long totalServicos;
    private Long servicosNoPrazo;
    private Long servicosAtrasados;

    public CumprimentoPrazoDTO(Long totalServicos, Long servicosNoPrazo, Long servicosAtrasados) {
        this.totalServicos = totalServicos;
        this.servicosNoPrazo = servicosNoPrazo;
        this.servicosAtrasados = servicosAtrasados;
    }

    // Getters e Setters
}

