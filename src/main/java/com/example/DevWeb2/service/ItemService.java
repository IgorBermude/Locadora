package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.repository.ItemRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository repository;

    public ItemService(ItemRepository repository) {
        this.repository = repository;
    }

    public List<Item> listar(){ return repository.findAll(); }

    public Optional<Item> pesquisar(Long id){ return repository.findById(id); }

    // Salva cria/atualiza conforme presença de id
    public Item adicionar(Item i){
        validar(i);
        // normaliza tipoItem
        i.setTipoItem(i.getTipoItem().trim().toUpperCase());
        // checar unicidade respeitando updates
        repository.findByNumeroSerie(i.getNumeroSerie().trim()).ifPresent(existing -> {
            if (i.getIdItem() == null || !existing.getIdItem().equals(i.getIdItem())) {
                throw new IllegalArgumentException("Já existe um item com este número de série");
            }
        });
        return repository.save(i);
    }

    @Transactional
    public void deletar(Long id){
        Item item = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));
        if (possuiLocacoes(item.getIdItem())) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de um item que possua locações");
        }
        repository.delete(item);
    }

    public long count(){ return repository.count(); }

    private void validar(Item i){
        if (i == null || i.getNumeroSerie() == null || i.getNumeroSerie().isBlank() ||
            i.getTitulo() == null || i.getDataAquisicao() == null || i.getTipoItem() == null || i.getTipoItem().isBlank()) {
            throw new IllegalArgumentException("Dados do item inválidos");
        }
        String tipo = i.getTipoItem().trim().toUpperCase();
        if (!(tipo.equals("FITA") || tipo.equals("DVD") || tipo.equals("BLURAY"))) {
            throw new IllegalArgumentException("Tipo do item inválido. Use FITA, DVD ou BLURAY");
        }
    }

    // TODO: implementar quando existir entidade Locacao
    private boolean possuiLocacoes(Long idItem){
        return false;
    }
}
