package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.domain.Locacao;
import com.example.DevWeb2.service.LocacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/locacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class LocacaoController {
    private final LocacaoService service;

    public LocacaoController(LocacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Locacao> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Locacao> buscar(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Novo: criar locação (pode enviar um JSON com cliente e item embutidos)
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Locacao requisicao) {
        try {
            Item item = requisicao.getItem();
            var cliente = requisicao.getCliente();
            service.efetuarNovaLocacao(item, cliente);
            // não temos o id retornado pelo service atualmente, retornamos 201 Created sem Location
            return ResponseEntity.status(201).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // Novo: alterar locação
    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody Locacao requisicao) {
        try {
            if (requisicao.getIdLocacao() != null && !requisicao.getIdLocacao().equals(id)) {
                return ResponseEntity.badRequest().body("ID da requisição difere do ID do recurso");
            }
            requisicao.setIdLocacao(id);
            Locacao atualizado = service.alterarLocacao(requisicao);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // Novo: cancelar/excluir locação (requer confirmação via query param ?confirm=true)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean confirm) {
        try {
            service.cancelarLocacao(id, confirm);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

}
