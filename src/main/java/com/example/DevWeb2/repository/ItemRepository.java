package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByNumeroSerie(String numeroSerie);
    boolean existsByNumeroSerie(String numeroSerie);
}
