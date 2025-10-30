package com.example.DevWeb2.repository;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findAll();

    Optional<Cliente> findById(Long id);

    Cliente save(Cliente c);

    void delete(Cliente cliente);

    long count();

    // busca títulos relacionados às locações do cliente (via Locacao -> Item -> Titulo)
    @Query("select distinct t from Locacao l join l.item i join i.titulo t where l.cliente.idCliente = :idCliente")
    List<Titulo> consultarTitulosPorCliente(@Param("idCliente") Long idCliente);
}
