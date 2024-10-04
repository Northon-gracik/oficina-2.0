package com.oficina.backend.services;

import com.oficina.backend.entitities.Client;
import com.oficina.backend.entitities.Vehicle;
import com.oficina.backend.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.time.Year;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ClientService clientService;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        validateVehicle(vehicle, null);
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Optional<Vehicle> existingVehicleOpt = vehicleRepository.findById(id);
        if (existingVehicleOpt.isPresent()) {
            Vehicle existingVehicle = existingVehicleOpt.get();
            validateVehicle(updatedVehicle, existingVehicle);
            existingVehicle.setMarca(updatedVehicle.getMarca());
            existingVehicle.setModelo(updatedVehicle.getModelo());
            existingVehicle.setAno(updatedVehicle.getAno());
            // existingVehicle.setKm(updatedVehicle.getKm());
            existingVehicle.setPlaca(updatedVehicle.getPlaca());
            existingVehicle.setNumeroChassi(updatedVehicle.getNumeroChassi());
            existingVehicle.setCor(updatedVehicle.getCor());
            existingVehicle.setClient(updatedVehicle.getClient());
            return vehicleRepository.save(existingVehicle);
        }
        return null;
    }

    private void validateVehicle(Vehicle vehicle, Vehicle existingVehicle) {
        if (vehicle.getMarca() == null || vehicle.getMarca().trim().isEmpty()) {
            throw new IllegalArgumentException("Marca é obrigatória");
        }
        if (vehicle.getMarca().length() > 50) {
            throw new IllegalArgumentException("Marca não pode ter mais de 50 caracteres");
        }

        if (vehicle.getModelo() == null || vehicle.getModelo().trim().isEmpty()) {
            throw new IllegalArgumentException("Modelo é obrigatório");
        }
        if (vehicle.getModelo().length() > 50) {
            throw new IllegalArgumentException("Modelo não pode ter mais de 50 caracteres");
        }

        if (vehicle.getAno() == null || !Pattern.matches("\\d{4}", vehicle.getAno())) {
            throw new IllegalArgumentException("Ano inválido");
        }
        int currentYear = Year.now().getValue();
        int vehicleYear = Integer.parseInt(vehicle.getAno());
        if (vehicleYear < 1900 || vehicleYear > currentYear + 1) {
            throw new IllegalArgumentException("Ano deve estar entre 1900 e " + (currentYear + 1));
        }

        // if (vehicle.getKm() == null || !Pattern.matches("\\d+", vehicle.getKm())) {
        //     throw new IllegalArgumentException("Quilometragem inválida");
        // }
        // long km = Long.parseLong(vehicle.getKm());
        // if (km < 0 || km > 999999) {
        //     throw new IllegalArgumentException("Quilometragem deve estar entre 0 e 999999");
        // }

        if (vehicle.getPlaca() == null || !Pattern.matches("[A-Z]{3}\\d[A-Z]\\d{2}|[A-Z]{3}\\d{4}", vehicle.getPlaca())) {
            throw new IllegalArgumentException("Placa inválida");
        }

        if (vehicleRepository.existsByPlaca(vehicle.getPlaca()) &&
            (existingVehicle == null || !vehicle.getPlaca().equals(existingVehicle.getPlaca()))) {
            throw new IllegalArgumentException("Placa já cadastrada");
        }

        if (vehicle.getNumeroChassi() == null || vehicle.getNumeroChassi().length() != 17) {
            throw new IllegalArgumentException("Número do chassi inválido");
        }
        if (!Pattern.matches("^[A-HJ-NPR-Z0-9]{17}$", vehicle.getNumeroChassi())) {
            throw new IllegalArgumentException("Número do chassi contém caracteres inválidos");
        }

        if (vehicleRepository.existsByNumeroChassi(vehicle.getNumeroChassi()) &&
            (existingVehicle == null || !vehicle.getNumeroChassi().equals(existingVehicle.getNumeroChassi()))) {
            throw new IllegalArgumentException("Número do chassi já cadastrado");
        }

        if (vehicle.getCor() == null || vehicle.getCor().trim().isEmpty()) {
            throw new IllegalArgumentException("Cor é obrigatória");
        }
        if (vehicle.getCor().length() > 20) {
            throw new IllegalArgumentException("Cor não pode ter mais de 20 caracteres");
        }

        if (vehicle.getClient() == null) {
            throw new IllegalArgumentException("Cliente é obrigatório");
        }
        if (!clientService.getClientById(vehicle.getClient().getId()).isPresent()) {
            throw new IllegalArgumentException("Cliente não encontrado");
        }
    }
}
