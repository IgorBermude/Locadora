package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.repository.TituloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TituloService {
    private final TituloRepository repository;

    public TituloService(TituloRepository repository) {
        this.repository = repository;
    }

    public List<Titulo> listar(){ return repository.findAll(); }
    public Optional<Titulo> pesquisar(Long id){ return repository.findById(id); }
    public Titulo adicionar(Titulo t){ return repository.save(t); }
    public void deletar(Long id){ repository.deleteById(id); }
    public long count(){ return repository.count(); }
}

