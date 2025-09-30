package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
    Optional<Classe> findByNome(String nome);
}

