package com.oficina.backend.controller;

import com.oficina.backend.entitities.Client;
import com.oficina.backend.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    private ResponseEntity<?> createErrorResponse(String message, Exception e, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        errorResponse.put("error", e.getMessage());
        errorResponse.put("status", status.value());
        return new ResponseEntity<>(errorResponse, status);
    }

    @GetMapping
    public ResponseEntity<?> getAllClients() {
        try {
            List<Client> clients = clientService.getAllClients();
            return new ResponseEntity<>(clients, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Erro ao buscar clientes", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id) {
        try {
            return clientService.getClientById(id)
                    .map(client -> ResponseEntity.ok().body(client))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        } catch (ResponseStatusException e) {
            return createErrorResponse(e.getReason(), e, HttpStatus.valueOf(e.getStatusCode().value()));
        } catch (Exception e) {
            return createErrorResponse("Erro ao buscar cliente", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        try {
            Client savedClient = clientService.saveClient(client);
            return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Erro de validação", e, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return createErrorResponse("Erro ao criar cliente", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(@PathVariable Long id, @RequestBody Client client) {
        try {
            Client updatedClient = clientService.updateClient(id, client);
            if (updatedClient != null) {
                return new ResponseEntity<>(updatedClient, HttpStatus.OK);
            } else {
                return createErrorResponse("Cliente não encontrado", new Exception("Cliente não encontrado"), HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return createErrorResponse("Erro de validação", e, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return createErrorResponse("Erro ao atualizar cliente", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        try {
            clientService.deleteClient(id);
            return new ResponseEntity<>("Cliente deletado com sucesso", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return createErrorResponse("Erro ao deletar cliente", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

// curl --request GET --url http://localhost:8080/clients --header 'tenant: emp_01234567891235'
// curl --request GET --url http://localhost:8080/clients/1 --header 'tenant: emp_01234567891235'
// curl --request POST --url http://localhost:8080/clients --header 'Content-Type: application/json' --header 'tenant: emp_01234567891235' --data '{"nomeCompleto":"John Doe","email":"john@example.com"}'
// curl --request PUT --url http://localhost:8080/clients/1 --header 'Content-Type: application/json' --header 'tenant: emp_01234567891235' --data '{"nomeCompleto":"John Updated","email":"john_updated@example.com"}'
// curl --request DELETE --url http://localhost:8080/clients/1 --header 'tenant: emp_01234567891235'
