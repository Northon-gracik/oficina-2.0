package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.oficina.backend.entitities.Vehicle;



public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByPlaca(String numeroTelefone);

    boolean existsByNumeroChassi(String email);

    @Query("SELECT v FROM Vehicle v WHERE (:clientId IS NULL OR v.client.id = :clientId) AND (LOWER(v.placa) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(v.marca) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(v.modelo) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Vehicle> findByPlacaMarcaOrModeloContaining(@Param("clientId") Long clientId, @Param("searchTerm") String searchTerm);

    List<Vehicle> findByClientId(@Param("clientId") Long clientId);
    

}
