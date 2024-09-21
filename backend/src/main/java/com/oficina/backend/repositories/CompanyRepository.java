package com.oficina.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oficina.backend.entitities.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByNome(String nome);

    Optional<Company> findByCnpj(String cnpj);
    
    @Query("SELECT c FROM Company c LEFT JOIN FETCH c.userRoles WHERE c.id = :id")
    Optional<Company> findByIdWithUserRoles(@Param("id") Long id);
}
