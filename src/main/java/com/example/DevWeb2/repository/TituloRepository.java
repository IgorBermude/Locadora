package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;

public interface TituloRepository extends JpaRepository<Titulo, Long> {

    @Query("select t from Titulo t left join fetch t.atores where t.idTitulo = :id")
    Optional<Titulo> findByIdWithAtores(@Param("id") Long id);

    // Busca por nome (case insensitive, parcial)
    @Query("SELECT t FROM Titulo t WHERE LOWER(t.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Titulo> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    // Busca por categoria/classe
    @Query("SELECT t FROM Titulo t WHERE t.classe.idClasse = :classeId")
    List<Titulo> findByClasseId(@Param("classeId") Long classeId);
    
    // Busca por ator (via join)
    @Query("SELECT t FROM Titulo t JOIN t.atores a WHERE a.idAtor = :atorId")
    List<Titulo> findByAtorId(@Param("atorId") Long atorId);
}
    