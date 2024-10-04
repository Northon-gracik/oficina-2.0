package com.oficina.backend.controller;

import com.oficina.backend.entitities.*;
import com.oficina.backend.enums.StatusManutencao;
import com.oficina.backend.services.ServicoService;
import com.oficina.backend.util.ErrorUtil;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @PostMapping
    public ResponseEntity<?> agendarServico(@RequestBody Agendamento agendamento) {
        try {
            return ResponseEntity.ok(servicoService.agendarServico(agendamento));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao criar serviço", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/identificar-veiculo")
    public ResponseEntity<?> identificarVeiculo(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        try {
            return ResponseEntity.ok(servicoService.identificarVeiculo(id, vehicle.getId()));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao identificar veiculo no serviço", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/{id}/inspecao-entrada")
    public ResponseEntity<?> realizarInspecaoEntrada(@PathVariable Long id, @RequestBody Inspecao inspecao) {
        try {
            return ResponseEntity.ok(servicoService.realizarInspecaoEntrada(id, inspecao));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao salvar inspeção no serviço", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/orcamento")
    public ResponseEntity<?> criarOrcamento(@PathVariable Long id, @RequestBody Orcamento orcamento) {

        try {
            return ResponseEntity.ok(servicoService.criarOrcamento(id, orcamento));
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/orcamento/inserir-item")
    public ResponseEntity<?> inserirItemOrcamento(@PathVariable Long id, @RequestBody ItemAFazer item) {
        try {
            System.out.println("TEste");
            return ResponseEntity.ok(servicoService.inserirItensOrcamento(id, item));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao adicionar item ao orçamento do serviço", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/orcamento/inserir-peca-item/{itemId}")
    public ResponseEntity<?> inserirPecaItem(@PathVariable Long id, @PathVariable Long itemId, @RequestBody Peca peca) {
        try {
            return ResponseEntity.ok(servicoService.inserirPecaItem(id, itemId, peca));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao adicionar peça ao item do orçamento do serviço", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/iniciar-manutencao")
    public ResponseEntity<?> iniciarManutencao(@PathVariable Long id, @RequestBody Manutencao manutencao) {

        try {
            return ResponseEntity.ok(servicoService.iniciarManutencao(id, manutencao));
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("mudar-status-item/{itemId}")
    public ResponseEntity<?> mudarStatusItem(@PathVariable Long itemId, @RequestBody ItemAFazer item) {
        try {
            return ResponseEntity.ok(servicoService.mudarStatusItem(itemId, item.getStatusManutencao()));
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PutMapping("/{id}/finalizar-manutencao")
    public ResponseEntity<?> finalizarManutencao(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(servicoService.finalizarManutencao(id));
        } catch (Exception e) {
            return ErrorUtil.createErrorResponse("Erro ao finalizar manutenção", e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/inspecao-saida")
    public ResponseEntity<?> realizarInspecaoSaida(@PathVariable Long id, @RequestBody Inspecao inspecao) {

        try {
            return ResponseEntity.ok(servicoService.realizarInspecaoSaida(id, inspecao));
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarServico(@PathVariable Long id, @RequestBody Entrega entrega) {

        try {
            return ResponseEntity.ok(servicoService.finalizarServico(id, entrega));
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodosServicos() {

        try {
            return ResponseEntity.ok(servicoService.listarTodosServicos());
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarServicoPorId(@PathVariable Long id) {

        try {
            return servicoService.buscarServicoPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/listar-itens-inspecao")
    public ResponseEntity<List<String>> getListItemInspecao() {
        return ResponseEntity.ok(servicoService.getListItemInspecao());
    }
    
}