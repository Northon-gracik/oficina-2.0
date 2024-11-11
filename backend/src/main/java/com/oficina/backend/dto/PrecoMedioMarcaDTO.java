package com.oficina.backend.dto;

import lombok.Data;

@Data
public class PrecoMedioMarcaDTO {
    private String nomeVeiculo;
    private Number precoMedio;

    public PrecoMedioMarcaDTO(String marca, Number precoMedio) {
        this.nomeVeiculo = marca;
        this.precoMedio = precoMedio;
    }
    
    public PrecoMedioMarcaDTO(String marca, String modelo, Number precoMedio) {
        this.nomeVeiculo = marca + " " + modelo;
        this.precoMedio = precoMedio;
    }
}
