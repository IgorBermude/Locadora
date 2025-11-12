package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TituloRepository extends JpaRepository<Titulo, Long> {

    @Query("select t from Titulo t left join fetch t.atores where t.idTitulo = :id")
    Optional<Titulo> findByIdWithAtores(@Param("id") Long id);
}
