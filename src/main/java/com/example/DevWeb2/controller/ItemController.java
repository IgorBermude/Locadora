package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.dto.ItemDTO;
import com.example.DevWeb2.service.ItemService;
import com.example.DevWeb2.service.TituloService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itens")
@CrossOrigin(origins = "http://localhost:4200")
public class ItemController {

    private final ItemService itemService;
    private final TituloService tituloService;

    public ItemController(ItemService itemService, TituloService tituloService) {
        this.itemService = itemService;
        this.tituloService = tituloService;
    }

    @GetMapping
    public List<ItemDTO> listar() {
        return itemService.listar().stream()
                .map(i -> {
                    ItemDTO dto = new ItemDTO();
                    dto.idItem = i.getIdItem(); // <--- importante
                    dto.numeroSerie = i.getNumeroSerie();
                    dto.tipoItem = i.getTipoItem();
                    dto.dataAquisicao = i.getDataAquisicao();
                    dto.tituloId = i.getTitulo().getIdTitulo();
                    return dto;
                })
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> buscar(@PathVariable Long id) {
        return itemService.pesquisar(id)
                .map(item -> {
                    ItemDTO dto = new ItemDTO();
                    dto.numeroSerie = item.getNumeroSerie();
                    dto.tipoItem = item.getTipoItem();
                    dto.dataAquisicao = item.getDataAquisicao();
                    dto.tituloId = item.getTitulo().getIdTitulo();
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody ItemDTO dto) {
        try {
            Titulo titulo = tituloService.pesquisar(dto.tituloId)
                    .orElseThrow(() -> new IllegalArgumentException("Título inválido"));
            Item item = new Item();
            item.setNumeroSerie(dto.numeroSerie);
            item.setTipoItem(dto.tipoItem);
            item.setDataAquisicao(dto.dataAquisicao);
            item.setTitulo(titulo);
            itemService.adicionar(item);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody ItemDTO dto) {
        return itemService.pesquisar(id).map(item -> {
            Titulo titulo = tituloService.pesquisar(dto.tituloId)
                    .orElseThrow(() -> new IllegalArgumentException("Título inválido"));
            item.setNumeroSerie(dto.numeroSerie);
            item.setTipoItem(dto.tipoItem);
            item.setDataAquisicao(dto.dataAquisicao);
            item.setTitulo(titulo);
            itemService.adicionar(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            itemService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
