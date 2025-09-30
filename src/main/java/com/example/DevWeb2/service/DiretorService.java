package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Diretor;
import com.example.DevWeb2.repository.DiretorRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DiretorService {

    private final DiretorRepository repository;

    public DiretorService(DiretorRepository repository) {
        this.repository = repository;
    }

    public List<Diretor> listar() { return repository.findAll(); }

    public Optional<Diretor> pesquisar(Long id) { return repository.findById(id); }

    public Diretor adicionar(Diretor d) {
        if (d == null || d.getNome() == null || d.getNome().isBlank()) {
            throw new IllegalArgumentException("Dados do diretor inválidos");
        }
        return repository.save(d);
    }

    @Transactional
    public void deletar(Long id) {
        Diretor diretor = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diretor não encontrado"));
        if (diretor.getTitulos() != null && !diretor.getTitulos().isEmpty()) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de um diretor relacionado a títulos");
        }
        repository.delete(diretor);
    }

    public long count() { return repository.count(); }
}
