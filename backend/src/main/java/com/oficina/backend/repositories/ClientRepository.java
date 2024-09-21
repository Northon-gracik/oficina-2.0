package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oficina.backend.entitities.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByNumeroTelefone(String numeroTelefone);

    boolean existsByEmail(String email);

    boolean existsByNumeroIdentificacao(String numeroIdentificacao);

}
