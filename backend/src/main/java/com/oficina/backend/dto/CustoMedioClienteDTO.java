package com.oficina.backend.dto;

import lombok.Data;

@Data
public class CustoMedioClienteDTO {

    private String clienteNome;
    private Double precoMedio;

    public CustoMedioClienteDTO(String clienteNome, Double precoMedio) {
        this.clienteNome = clienteNome;
        this.precoMedio = precoMedio;
    }
}
