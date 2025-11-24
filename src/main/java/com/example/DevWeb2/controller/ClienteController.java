package com.example.DevWeb2.controller;


import com.example.DevWeb2.dto.ClienteDTO;
import com.example.DevWeb2.dto.TituloDTO;
import com.example.DevWeb2.mapper.ClienteMapper;
import com.example.DevWeb2.mapper.TituloMapper;
import com.example.DevWeb2.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClienteDTO> listar() {
        return service.listar().stream().map(ClienteMapper::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscar(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(ClienteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar ou atualizar Cliente genérico não é permitido nesta estratégia.
    // Use api/socios e /api/dependentes endpoints para criar subtipos específicos.

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/desativar")
    public ResponseEntity<Void> desativarCliente(@PathVariable Long id) {
        service.desativarCliente(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarCliente(@PathVariable Long id) {
        service.reativarCliente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/titulos")
    public ResponseEntity<List<TituloDTO>> consultarTitulosCliente(@PathVariable Long id) {
        List<TituloDTO> titulos = service.consultarTitulosCliente(id)
                .stream()
                .map(TituloMapper::tituloToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(titulos);
    }
}
