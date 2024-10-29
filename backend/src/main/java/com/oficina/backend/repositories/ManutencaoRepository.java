package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oficina.backend.entitities.Manutencao;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

}
