package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Locacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocacaoRepository extends JpaRepository<Locacao, Long> {
    Locacao save(Locacao nova);

    List<Locacao> findAll();

    Optional<Locacao> findById(Long id);

    void delete(Locacao l);

    @Query("select l from Locacao l where l.item.numeroSerie = :numeroSerie and l.dtDevolucaoEfetiva is null")
    List<Locacao> findByItem_NumeroSerieAndDtDevolucaoEfetivaIsNull(String numeroSerie);

    // busca a locação vigente (não devolvida) pelo número de série do item
    @Query("select l from Locacao l where l.item.numeroSerie = :serie and l.dtDevolucaoEfetiva is null")
    Optional<Locacao> findVigenteByItemNumeroSerie(@Param("serie") String serie);
}
