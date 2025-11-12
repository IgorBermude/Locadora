package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.repository.AtorRepository;
import com.example.DevWeb2.repository.TituloRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class TituloService {
    private final TituloRepository repository;
    private final AtorRepository atorRepository;

    public TituloService(TituloRepository repository, AtorRepository atorRepository) {
        this.atorRepository = atorRepository;
        this.repository = repository;
    }

    public List<Titulo> listar(){ return repository.findAll(); }
    public Optional<Titulo> pesquisar(Long id){ return repository.findById(id); }

    // Corrigido: antes de deletar, limpar associações ManyToMany no lado dono (Ator)
    @Transactional
    public void deletar(Long id){
        // busca o título com atores (findByIdWithAtores deve existir em TituloRepository)
        Titulo titulo = repository.findByIdWithAtores(id)
                .orElseThrow(() -> new IllegalArgumentException("Título não encontrado: " + id));

        // remove o título de cada ator (manter integridade do join table)
        for (Ator ator : new HashSet<>(titulo.getAtores())) {
            ator.removeTitulo(titulo);
            atorRepository.save(ator);
        }

        // agora é seguro apagar o título
        repository.delete(titulo);
    }

    public long count(){ return repository.count(); }

    @Transactional
    public Titulo adicionar(Titulo titulo) {
        // guarda os atores enviados no payload
        Set<Ator> atoresPayload = titulo.getAtores() != null
                ? new HashSet<>(titulo.getAtores())
                : Collections.emptySet();

        // limpa o lado inverso para evitar estado inconsistente antes de salvar
        titulo.setAtores(new HashSet<>());

        // salva o Titulo para garantir o ID
        Titulo salvo = repository.save(titulo);

        // vincula pelo lado dono (Ator) e salva o ator
        for (Ator a : atoresPayload) {
            if (a == null || a.getId() == null) continue; // espera atores já existentes
            Ator managed = atorRepository.getReferenceById(a.getId());
            managed.addTitulo(salvo);
            atorRepository.save(managed);
        }
        return salvo;
    }
}
