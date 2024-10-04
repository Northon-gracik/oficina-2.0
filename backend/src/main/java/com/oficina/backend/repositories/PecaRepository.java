package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oficina.backend.entitities.Peca;

public interface PecaRepository extends JpaRepository<Peca, Long> {

}
