package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.repository.ClasseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ClasseService {
    @Autowired
    private ClasseRepository classeRepository;

    public Classe incluirClasse(Classe classe) {
        if (classe.getNome() == null || classe.getNome().isBlank() ||
                classe.getValor() == null || classe.getValor().compareTo(BigDecimal.ZERO) <= 0 ||
                classe.getDataDevolucao() == null) {
            throw new IllegalArgumentException("Dados de classe inválidos");
        }
        if (classeRepository.findByNome(classe.getNome()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma classe com esse nome");
        }
        return classeRepository.save(classe);
    }

    public Classe alterarClasse(Classe classe) {
        Classe existente = classeRepository.findById(classe.getIdClasse())
                .orElseThrow(() -> new IllegalArgumentException("Classe não encontrada"));

        if (classe.getNome() == null || classe.getNome().isBlank() ||
                classe.getValor() == null || classe.getValor().compareTo(BigDecimal.ZERO) <= 0 ||
                classe.getDataDevolucao() == null) {
            throw new IllegalArgumentException("Dados de classe inválidos");
        }

        existente.setNome(classe.getNome());
        existente.setValor(classe.getValor());
        existente.setDataDevolucao(classe.getDataDevolucao());

        return classeRepository.save(existente);
    }

    @Transactional
    public void excluirClasse(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Classe não encontrada"));
        if (classe.getTitulos() != null && !classe.getTitulos().isEmpty()) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de uma classe relacionada a títulos");
        }
        classeRepository.delete(classe);
    }

    public List<Classe> listarTodas() {
        return classeRepository.findAll();
    }

    public Optional<Classe> buscarPorId(Long id) {
        return classeRepository.findById(id);
    }
}
