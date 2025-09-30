package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.service.ClasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
public class ClasseController {
    @Autowired
    private ClasseService classeService;

    @GetMapping
    public List<Classe> listarTodas() {
        return classeService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classe> buscarPorId(@PathVariable Long id) {
        Optional<Classe> classe = classeService.buscarPorId(id);
        return classe.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> incluirClasse(@RequestBody ClasseDTO dto) {
        try {
            Classe classe = classeService.incluirClasse(dto.nome, dto.valor, dto.dataDevolucao);
            return ResponseEntity.status(HttpStatus.CREATED).body(classe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterarClasse(@PathVariable Long id, @RequestBody ClasseDTO dto) {
        try {
            Classe classe = classeService.alterarClasse(id, dto.nome, dto.valor, dto.dataDevolucao);
            return ResponseEntity.ok(classe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirClasse(@PathVariable Long id) {
        try {
            classeService.excluirClasse(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO interno para receber dados do frontend
    public static class ClasseDTO {
        public String nome;
        public BigDecimal valor;
        public LocalDate dataDevolucao;
    }
}

