package com.oficina.backend.dto;

import com.oficina.backend.enums.StatusServico;

import lombok.Data;

@Data
public class StatusServicosDTO {
    private StatusServico status;
    private Long quantidade;

    public StatusServicosDTO(StatusServico status, Long quantidade) {
        this.status = status;
        this.quantidade = quantidade;
    }
    
    // Getters e Setters
}

