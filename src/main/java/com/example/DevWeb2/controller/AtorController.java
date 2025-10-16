package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.service.AtorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/atores") // prefixo /api para diferenciar da parte Thymeleaf
@CrossOrigin(origins = "http://localhost:4200") // libera CORS para Angular
public class AtorController {

    private final AtorService service;

    public AtorController(AtorService service) {
        this.service = service;
    }

    // GET /api/atores → lista todos
    @GetMapping
    public List<Ator> getAll() {
        return service.listar();
    }

    // GET /api/atores/{id} → retorna ator específico
    @GetMapping("/{id}")
    public ResponseEntity<Ator> getById(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/atores → cria novo ator
    @PostMapping
    public ResponseEntity<Ator> create(@RequestBody Ator ator) {
        Ator salvo = service.adicionar(ator);
        return new ResponseEntity<>(salvo, HttpStatus.CREATED);
    }

    // PUT /api/atores/{id} → atualiza ator existente
    @PutMapping("/{id}")
    public ResponseEntity<Ator> update(@PathVariable Long id, @RequestBody Ator ator) {
        return service.pesquisar(id)
                .map(existing -> {
                    ator.setId(id); // garante que o id é o mesmo
                    Ator atualizado = service.adicionar(ator);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/atores/{id} → deleta ator
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.pesquisar(id).isPresent()) {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
