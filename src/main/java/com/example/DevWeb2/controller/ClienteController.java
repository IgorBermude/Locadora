package com.example.DevWeb2.controller;


import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.dto.ClienteDTO;
import com.example.DevWeb2.dto.TituloDTO;
import com.example.DevWeb2.mapper.ClienteMapper;
import com.example.DevWeb2.mapper.TituloMapper;
import com.example.DevWeb2.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
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

    @PostMapping
    public ResponseEntity<ClienteDTO> criar(@RequestBody @Valid ClienteDTO clienteDto) {
        Cliente c = ClienteMapper.toDomain(clienteDto);
        Cliente criado = service.adicionar(c);
        ClienteDTO dto = ClienteMapper.toDTO(criado);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(criado.getIdCliente()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ClienteDTO clienteDto) {
        Cliente c = ClienteMapper.toDomain(clienteDto);
        if (c.getIdCliente() == null) c.setIdCliente(id);
        if (!id.equals(c.getIdCliente())) return ResponseEntity.badRequest().build();
        Cliente atualizado = service.alterarCliente(c);
        return ResponseEntity.ok(ClienteMapper.toDTO(atualizado));
    }

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
