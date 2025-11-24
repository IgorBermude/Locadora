package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.dto.DependenteDTO;
import com.example.DevWeb2.dto.SocioDTO;
import com.example.DevWeb2.mapper.DependenteMapper;
import com.example.DevWeb2.mapper.SocioMapper;
import com.example.DevWeb2.repository.ClienteRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "http://localhost:4200")
public class SocioController {
    private final ClienteRepository clienteRepo;

    public SocioController(ClienteRepository clienteRepo) {
        this.clienteRepo = clienteRepo;
    }

    @GetMapping
    public List<SocioDTO> listAll() {
        return clienteRepo.findAll().stream()
                .filter(c -> c instanceof Socio)
                .map(c -> SocioMapper.toDTO((Socio) c))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocioDTO> getById(@PathVariable Long id) {
        Optional<Cliente> opt = clienteRepo.findById(id);
        return opt.filter(c -> c instanceof Socio)
                .map(c -> ResponseEntity.ok(SocioMapper.toDTO((Socio) c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SocioDTO> create(@Valid @RequestBody SocioDTO socioDto) {
        Socio socio = SocioMapper.toDomain(socioDto);
        Socio saved = (Socio) clienteRepo.save(socio);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(saved.getIdCliente()).toUri();
        return ResponseEntity.created(uri).body(SocioMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocioDTO> update(@PathVariable Long id, @Valid @RequestBody SocioDTO dto) {
        return clienteRepo.findById(id).filter(c -> c instanceof Socio).map(existing -> {
            Socio s = (Socio) existing;
            // aplicar alterações permitidas
            s.setCpf(dto.getCpf());
            s.setTel(dto.getTel());
            s.setNome(dto.getNome());
            s.setNumInscricao(dto.getNumInscricao());
            s.setDtNascimento(dto.getDtNascimento());
            s.setEstahAtivo(dto.isEstahAtivo());
            Socio updated = (Socio) clienteRepo.save(s);
            return ResponseEntity.ok(SocioMapper.toDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return clienteRepo.findById(id).filter(c -> c instanceof Socio).map(s -> {
            clienteRepo.delete(s);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/dependentes")
    public ResponseEntity<List<DependenteDTO>> listDependentes(@PathVariable Long id) {
        return clienteRepo.findById(id).filter(c -> c instanceof Socio).map(c -> {
            Socio s = (Socio) c;
            List<DependenteDTO> list = s.getDependentes().stream().map(DependenteMapper::toDTO).collect(Collectors.toList());
            return ResponseEntity.ok(list);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/dependentes")
    public ResponseEntity<DependenteDTO> addDependente(@PathVariable Long id, @Valid @RequestBody DependenteDTO depDto) {
        return clienteRepo.findById(id).filter(c -> c instanceof Socio).map(c -> {
            Socio s = (Socio) c;
            Dependente dep = DependenteMapper.toDomain(depDto, s);
            Dependente saved = (Dependente) clienteRepo.save(dep);
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{depId}")
                    .buildAndExpand(saved.getIdCliente()).toUri();
            return ResponseEntity.created(uri).body(DependenteMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }
}
