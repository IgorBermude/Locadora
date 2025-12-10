package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.domain.Diretor;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.repository.AtorRepository;
import com.example.DevWeb2.repository.ClasseRepository;
import com.example.DevWeb2.repository.DiretorRepository;
import com.example.DevWeb2.repository.TituloRepository;
import com.example.DevWeb2.service.TituloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/titulos")
@CrossOrigin(origins = "http://localhost:4200")
public class TituloController {

    private final TituloService tituloService;
    private final TituloRepository tituloRepository;
    private final AtorRepository atorRepository;
    private final ClasseRepository classeRepository;
    private final DiretorRepository diretorRepository;

    public TituloController(TituloService tituloService,
            TituloRepository tituloRepository,
            AtorRepository atorRepository,
            ClasseRepository classeRepository,
            DiretorRepository diretorRepository) {
        this.tituloService = tituloService;
        this.tituloRepository = tituloRepository;
        this.atorRepository = atorRepository;
        this.classeRepository = classeRepository;
        this.diretorRepository = diretorRepository;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(tituloService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Titulo> buscar(@PathVariable Long id) {
        return tituloService.pesquisar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 1. Consulta por nome (busca parcial, case insensitive)
    @GetMapping("/buscar/nome")
    public ResponseEntity<List<Titulo>> buscarPorNome(@RequestParam String nome) {
        List<Titulo> titulos = tituloRepository.findByNomeContainingIgnoreCase(nome);
        return ResponseEntity.ok(titulos);
    }

    // 2. Consulta por categoria (classe)
    @GetMapping("/buscar/categoria")
    public ResponseEntity<List<Titulo>> buscarPorCategoria(@RequestParam Long categoriaId) {
        List<Titulo> titulos = tituloRepository.findByClasseId(categoriaId);
        return ResponseEntity.ok(titulos);
    }

    // 3. Consulta por ator
    @GetMapping("/buscar/ator")
    public ResponseEntity<List<Titulo>> buscarPorAtor(@RequestParam Long atorId) {
        List<Titulo> titulos = tituloRepository.findByAtorId(atorId);
        return ResponseEntity.ok(titulos);
    }
    // 4. Consulta todos os títulos com informações completas (para o cliente)
    @GetMapping("/cliente/todos")
    public ResponseEntity<List<Titulo>> listarParaCliente() {
        List<Titulo> titulos = tituloRepository.findAll();
        return ResponseEntity.ok(titulos);
    }

    @PostMapping
    public ResponseEntity<Titulo> salvar(@RequestBody Titulo titulo) {
        Titulo salvo = tituloService.adicionar(titulo);
        return ResponseEntity.ok(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Titulo> atualizar(@PathVariable Long id, @RequestBody Titulo titulo) {
        return tituloService.pesquisar(id)
                .map(existente -> {
                    // Atualiza o nome
                    existente.setNome(titulo.getNome());

                    // Atualiza Classe e Diretor
                    if (titulo.getClasse() != null && titulo.getClasse().getIdClasse() != null) {
                        Classe classeGerenciada = classeRepository.getReferenceById(titulo.getClasse().getIdClasse());
                        existente.setClasse(classeGerenciada);
                    }

                    if (titulo.getDiretor() != null && titulo.getDiretor().getIdDiretor() != null) {
                        Diretor diretorGerenciado = diretorRepository
                                .getReferenceById(titulo.getDiretor().getIdDiretor());
                        existente.setDiretor(diretorGerenciado);
                    }

                    // Atualiza atores
                    // Remove relações antigas
                    existente.getAtores().forEach(a -> a.getTitulos().remove(existente));
                    existente.getAtores().clear();

                    // Adiciona novas relações
                    if (titulo.getAtores() != null) {
                        for (Ator a : titulo.getAtores()) {
                            if (a.getIdAtor() != null) {
                                Ator atorGerenciado = atorRepository.getReferenceById(a.getIdAtor());
                                atorGerenciado.addTitulo(existente);
                            }
                        }
                    }

                    // Salva título atualizado
                    Titulo atualizado = tituloRepository.save(existente);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tituloService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
