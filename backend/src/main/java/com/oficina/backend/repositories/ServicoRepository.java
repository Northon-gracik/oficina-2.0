package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oficina.backend.entitities.Servico;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    
    public Servico findByManutencaoId(Long id);
}
