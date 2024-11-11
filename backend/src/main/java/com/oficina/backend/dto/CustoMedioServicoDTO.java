package com.oficina.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CustoMedioServicoDTO {

    private Double custoMedio;

    public CustoMedioServicoDTO(Double custoMedio) {
        this.custoMedio = custoMedio;
    }

    // Getters e Setters
}
