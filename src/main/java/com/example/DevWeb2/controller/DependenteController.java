package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.dto.DependenteDTO;
import com.example.DevWeb2.mapper.DependenteMapper;
import com.example.DevWeb2.repository.ClienteRepository;
import com.example.DevWeb2.service.DependenteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dependentes")
@CrossOrigin(origins = "http://localhost:4200")
public class DependenteController {
    private final ClienteRepository clienteRepo;
    private final DependenteService dependenteService;

    public DependenteController(ClienteRepository clienteRepo, DependenteService dependenteService) {
        this.clienteRepo = clienteRepo;
        this.dependenteService = dependenteService;
    }

    @GetMapping
    public List<DependenteDTO> listAll(){
        return clienteRepo.findAll().stream()
                .filter(c -> c instanceof Dependente)
                .map(c -> DependenteMapper.toDTO((Dependente) c))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DependenteDTO> getById(@PathVariable Long id) {
        Optional<Cliente> opt = clienteRepo.findById(id);
        return opt.filter(c -> c instanceof Dependente)
                .map(c -> ResponseEntity.ok(DependenteMapper.toDTO((Dependente) c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DependenteDTO dependenteDto) {
        if (dependenteDto == null || dependenteDto.getClienteId() == null) {
            return ResponseEntity.badRequest().body("Campo clienteId é obrigatório");
        }

        Long clienteId = dependenteDto.getClienteId();
        Optional<Cliente> opt = clienteRepo.findById(clienteId);
        if (opt.isEmpty() || !(opt.get() instanceof Socio)) {
            return ResponseEntity.badRequest().body("Sócio informado não encontrado");
        }
        Socio socio = (Socio) opt.get();

        Dependente dependente = DependenteMapper.toDomain(dependenteDto, socio);
        Dependente saved;
        try {
            saved = dependenteService.adicionar(clienteId, dependente);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(saved.getIdCliente()).toUri();
        return ResponseEntity.created(uri).body(DependenteMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DependenteDTO> update(@PathVariable Long id, @Valid @RequestBody DependenteDTO dto) {
        return clienteRepo.findById(id).filter(c -> c instanceof Dependente).map(existing -> {
            Dependente d = (Dependente) existing;
            // aplicar alterações permitidas
            d.setNome(dto.getNome());
            d.setDtNascimento(dto.getDtNascimento());
            d.setSexo(dto.getSexo());
            d.setEstahAtivo(dto.isEstahAtivo());
            d.setNumInscricao(dto.getNumInscricao());
            Dependente updated = (Dependente) clienteRepo.save(d);
            return ResponseEntity.ok(DependenteMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }
}
