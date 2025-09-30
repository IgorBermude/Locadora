package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Classe;
import com.example.DevWeb2.repository.ClasseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ClasseService {
    @Autowired
    private ClasseRepository classeRepository;

    public Classe incluirClasse(String nome, BigDecimal valor, LocalDate dataDevolucao) {
        if (nome == null || nome.isBlank() || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0 || dataDevolucao == null) {
            throw new IllegalArgumentException("Dados de classe inválidos");
        }
        if (classeRepository.findByNome(nome).isPresent()) {
            throw new IllegalArgumentException("Já existe uma classe com esse nome");
        }
        Classe classe = new Classe();
        classe.setNome(nome);
        classe.setValor(valor);
        classe.setDataDevolucao(dataDevolucao);
        return classeRepository.save(classe);
    }

    public Classe alterarClasse(Long id, String nome, BigDecimal valor, LocalDate dataDevolucao) {
        Classe classe = classeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Classe não encontrada"));
        if (nome == null || nome.isBlank() || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0 || dataDevolucao == null) {
            throw new IllegalArgumentException("Dados de classe inválidos");
        }
        classe.setNome(nome);
        classe.setValor(valor);
        classe.setDataDevolucao(dataDevolucao);
        return classeRepository.save(classe);
    }

    @Transactional
    public void excluirClasse(Long id) {
        Classe classe = classeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Classe não encontrada"));
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
