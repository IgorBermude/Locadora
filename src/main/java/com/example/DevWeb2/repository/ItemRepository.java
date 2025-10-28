package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByNumeroSerie(String numeroSerie);
    boolean existsByNumeroSerie(String numeroSerie);
}
