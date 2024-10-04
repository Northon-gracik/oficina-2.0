package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oficina.backend.entitities.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

}
