package com.oficina.backend.controller;

import com.oficina.backend.entitities.Vehicle;
import com.oficina.backend.services.VehicleService;
import com.oficina.backend.util.ErrorUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao buscar veículos", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        try {
            return vehicleService.getVehicleById(id)
                    .map(vehicle -> ResponseEntity.ok().body(vehicle))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veículo não encontrado"));
        } catch (ResponseStatusException e) {
            return ErrorUtil.createErrorResponse(e.getReason(), e, HttpStatus.valueOf(e.getStatusCode().value()));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao buscar veículo", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createVehicle(@RequestBody Vehicle vehicle) {
        try {
            Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
            return new ResponseEntity<>(savedVehicle, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ErrorUtil.createErrorResponse("Erro de validação", e, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao criar veículo", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        try {
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
            if (updatedVehicle != null) {
                return new ResponseEntity<>(updatedVehicle, HttpStatus.OK);
            } else {
                return ErrorUtil.createErrorResponse("Veículo não encontrado", new Exception("Veículo não encontrado"), HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return ErrorUtil.createErrorResponse("Erro de validação", e, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao atualizar veículo", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return new ResponseEntity<>("Veículo deletado com sucesso", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao deletar veículo", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    

    @GetMapping("/search")
    public ResponseEntity<?> searchVehicles(
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestParam("searchTerm") String searchTerm) {
        try {
            List<Vehicle> vehicles = vehicleService.searchVehicles(clientId, searchTerm);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao buscar veículos", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> findByClientId(@PathVariable Long clientId) {
        try {
            List<Vehicle> vehicles = vehicleService.findByClientId(clientId);
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao buscar veículos do cliente", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

    // curl --request GET --url http://localhost:8080/vehicles/search?clientId=1&searchTerm=termo-de-busca

// curl --request GET --url http://localhost:8080/vehicles
// curl --request GET --url http://localhost:8080/vehicles/1
// curl --request POST --url http://localhost:8080/vehicles --header 'Content-Type: application/json' --data '{"marca":"Toyota","modelo":"Corolla","ano":"2022","km":"10000","placa":"ABC1D23","numeroChassi":"1HGBH41JXMN109186","cor":"Preto","client":{"id":1}}'
// curl --request PUT --url http://localhost:8080/vehicles/1 --header 'Content-Type: application/json' --data '{"marca":"Honda","modelo":"Civic","ano":"2023","km":"5000","placa":"XYZ9F87","numeroChassi":"2FGBH41JXMN109187","cor":"Branco","client":{"id":1}}'
// curl --request DELETE --url http://localhost:8080/vehicles/1
