package com.oficina.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oficina.backend.entitities.Company;
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long>{
    
    Optional<Company> findByNome(String nome);

    Optional<Company> findByCnpj(String cnpj);
}
