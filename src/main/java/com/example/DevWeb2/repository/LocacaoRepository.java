package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Locacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocacaoRepository extends JpaRepository<Locacao, Long> {
    Locacao save(Locacao nova);

    List<Locacao> findAll();

    Optional<Locacao> findById(Long id);

    void delete(Locacao l);
}
