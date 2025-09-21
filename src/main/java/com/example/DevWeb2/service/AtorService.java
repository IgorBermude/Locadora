package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.repository.AtorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AtorService {
    private final AtorRepository repository;

    public AtorService(AtorRepository repository) {
        this.repository = repository;
    }

    public List<Ator> listar() { return repository.findAll(); }

    public Optional<Ator> pesquisar(Long id) { return repository.findById(id); }

    public Ator adicionar(Ator a) { return repository.save(a); }

    public void deletar(Long id) { repository.deleteById(id); }

    public long count() { return repository.count(); }
}
