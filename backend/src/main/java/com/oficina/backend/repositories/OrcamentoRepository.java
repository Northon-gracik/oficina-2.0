package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oficina.backend.entitities.Orcamento;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

}
