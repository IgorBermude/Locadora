package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.service.TituloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/titulos")
@CrossOrigin(origins = "http://localhost:4200")
public class TituloController {

    private final TituloService service;

    public TituloController(TituloService service) {
        this.service = service;
    }

    @GetMapping
    public List<Titulo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Titulo> buscar(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Titulo salvar(@RequestBody Titulo titulo) {
        return service.adicionar(titulo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Titulo> atualizar(@PathVariable Long id, @RequestBody Titulo titulo) {
        return service.pesquisar(id)
                .map(t -> {
                    titulo.setIdTitulo(id);
                    return ResponseEntity.ok(service.adicionar(titulo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
