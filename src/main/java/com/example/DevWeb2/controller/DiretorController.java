package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Diretor;
import com.example.DevWeb2.dto.ClasseDTO;
import com.example.DevWeb2.dto.DiretorDTO;
import com.example.DevWeb2.dto.TituloDTO;
import com.example.DevWeb2.service.DiretorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diretores")
@CrossOrigin(origins = "http://localhost:4200")
public class DiretorController {

    private final DiretorService service;

    public DiretorController(DiretorService service) {
        this.service = service;
    }

    @GetMapping
    public List<DiretorDTO> listar() {
        return service.listar().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiretorDTO> buscar(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DiretorDTO salvar(@RequestBody Diretor diretor) {
        Diretor d = service.adicionar(diretor);
        return toDTO(d);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiretorDTO> atualizar(@PathVariable Long id, @RequestBody Diretor diretor) {
        return service.pesquisar(id)
                .map(d -> {
                    diretor.setIdDiretor(d.getIdDiretor());
                    Diretor atualizado = service.adicionar(diretor);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // Conversão da entidade para DTO
    private DiretorDTO toDTO(Diretor diretor) {
        DiretorDTO dto = new DiretorDTO();
        dto.setIdDiretor(diretor.getIdDiretor());
        dto.setNome(diretor.getNome());

        List<TituloDTO> titulos = diretor.getTitulos().stream().map(titulo -> {
            TituloDTO tDto = new TituloDTO();
            tDto.setIdTitulo(titulo.getIdTitulo());
            tDto.setNome(titulo.getNome());

            if (titulo.getClasse() != null) {
                ClasseDTO cDto = new ClasseDTO();
                cDto.setIdClasse(titulo.getClasse().getIdClasse());
                cDto.setNome(titulo.getClasse().getNome());
                cDto.setValor(titulo.getClasse().getValor());
                cDto.setDataDevolucao(titulo.getClasse().getDataDevolucao());
                tDto.setClasse(cDto);
            }

            return tDto;
        }).collect(Collectors.toList());

        dto.setTitulos(titulos);
        return dto;
    }
}
