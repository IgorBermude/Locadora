package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.dto.ClasseDTO;
import com.example.DevWeb2.mapper.ClasseMapper;
import com.example.DevWeb2.service.ClasseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.DevWeb2.mapper.ClasseMapper.toDTO;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClasseController {

    private final ClasseService classeService;

    public ClasseController(ClasseService classeService) {
        this.classeService = classeService;
    }

    @GetMapping
    public List<ClasseDTO> listarTodas() {
        return classeService.listarTodas().stream()
                .map(ClasseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasseDTO> buscarPorId(@PathVariable Long id) {
        return classeService.buscarPorId(id)
                .map(ClasseMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClasseDTO> incluirClasse(@RequestBody ClasseDTO dto) {
        Classe classe = new Classe();
        classe.setNome(dto.getNome());
        classe.setValor(dto.getValor());
        classe.setDataDevolucao(dto.getDataDevolucao());
        Classe salvo = classeService.incluirClasse(classe);
        return ResponseEntity.status(201).body(toDTO(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClasseDTO> alterarClasse(@PathVariable Long id, @RequestBody ClasseDTO dto) {
        return classeService.buscarPorId(id)
                .map(classe -> {
                    classe.setNome(dto.getNome());
                    classe.setValor(dto.getValor());
                    classe.setDataDevolucao(dto.getDataDevolucao());
                    Classe atualizado = classeService.alterarClasse(classe);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirClasse(@PathVariable Long id) {
        classeService.excluirClasse(id);
        return ResponseEntity.noContent().build();
    }
}
