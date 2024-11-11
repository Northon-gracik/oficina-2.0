package com.oficina.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.oficina.backend.dto.RelatorioPecaDTO;
import com.oficina.backend.dto.RelatorioPecaUtilizadaDTO;
import com.oficina.backend.entitities.Peca;

public interface PecaRepository extends JpaRepository<Peca, Long> {

    @Query("SELECT new com.oficina.backend.dto.RelatorioPecaUtilizadaDTO(" +
            "p.nome, SUM(p.quantidade), SUM(p.valorUnitario * p.quantidade)) " +
            "FROM Peca p GROUP BY p.nome")
    List<RelatorioPecaUtilizadaDTO> findRelatorioPecasUtilizadas();
    
}

