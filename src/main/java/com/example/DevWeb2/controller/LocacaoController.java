package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.domain.Locacao;
import com.example.DevWeb2.dto.LocacaoDTO;
import com.example.DevWeb2.mapper.ClienteMapper;
import com.example.DevWeb2.mapper.DependenteMapper;
import com.example.DevWeb2.mapper.LocacaoMapper;
import com.example.DevWeb2.repository.ClienteRepository;
import com.example.DevWeb2.repository.ItemRepository;
import com.example.DevWeb2.repository.LocacaoRepository;
import com.example.DevWeb2.service.LocacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class LocacaoController {
    private final LocacaoService service;
    private final ClienteRepository clienteRepository;
    private final ItemRepository itemRepository;
    private final LocacaoRepository locacaoRepository;

    public LocacaoController(LocacaoService service, ClienteRepository clienteRepository, ItemRepository itemRepository, LocacaoRepository locacaoRepository) {
        this.service = service;
        this.clienteRepository = clienteRepository;
        this.itemRepository = itemRepository;
        this.locacaoRepository = locacaoRepository;
    }

    @GetMapping
    public List<LocacaoDTO> listar() {
        return service.listar().stream()
                .map(LocacaoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // java
    @GetMapping("/{id}")
    public ResponseEntity<LocacaoDTO> buscar(@PathVariable Long id) {
        return locacaoRepository.findById(id)
                .map(LocacaoMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Novo: criar locação usando DTO com ids
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody LocacaoDTO dto) {
        try {
            if (dto.getClienteId() == null || dto.getItemId() == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "clienteId e itemId são obrigatórios"));
            }

            Item item = itemRepository.findById(dto.getItemId()).orElse(null);
            var cliente = clienteRepository.findById(dto.getClienteId()).orElse(null);

            if (item == null) return ResponseEntity.status(404).body(Map.of("erro", "Item não encontrado"));
            if (cliente == null) return ResponseEntity.status(404).body(Map.of("erro", "Cliente não encontrado"));

            service.efetuarNovaLocacao(item, cliente);

            // retorna 201 Created (Location pode ser melhorada retornando o id criado se service retornar)
            return ResponseEntity.status(201).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // Novo: alterar locação usando DTO
    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody LocacaoDTO dto) {
        try {
            // construir um objeto Locacao parcial para passar ao service
            Locacao requisicao = new Locacao();
            requisicao.setIdLocacao(id);

            if (dto.getDataLocacao() != null && !dto.getDataLocacao().isBlank()) {
                requisicao.setDtLocacao(LocalDate.parse(dto.getDataLocacao()));
            }
            if (dto.getDataDevolucao() != null && !dto.getDataDevolucao().isBlank()) {
                requisicao.setDtDevolucaoPrevista(LocalDate.parse(dto.getDataDevolucao()));
            }

            if (dto.getItemId() != null) {
                Item item = itemRepository.findById(dto.getItemId()).orElse(null);
                if (item == null) return ResponseEntity.status(404).body(Map.of("erro", "Item não encontrado"));
                requisicao.setItem(item);
            }

            if (dto.getClienteId() != null) {
                var cliente = clienteRepository.findById(dto.getClienteId()).orElse(null);
                if (cliente == null) return ResponseEntity.status(404).body(Map.of("erro", "Cliente não encontrado"));
                requisicao.setCliente(cliente);
            }

            Locacao atualizado = service.alterarLocacao(requisicao);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // Novo: cancelar/excluir locação (requer confirmação via query param ?confirm=true)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean confirm) {
        try {
            service.cancelarLocacao(id, confirm);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // endpoint padronizado para registrar devolução por número de série
    @PostMapping("/devolucao")
    public ResponseEntity<?> registrarDevolucao(@RequestBody Map<String, String> body) {
        String numeroSerie = body.get("numeroSerie");
        if (numeroSerie == null || numeroSerie.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "numeroSerie é obrigatório"));
        }

        try {
            Locacao loc = service.registrarDevolucaoPorNumeroSerie(numeroSerie);

            // retorno mínimo com informações relevantes (ajuste para usar DTO se existir)
            return ResponseEntity.ok(Map.of(
                    "idLocacao", loc.getIdLocacao(),
                    "numeroSerie", numeroSerie,
                    "dataDevolucaoEfetiva", loc.getDtDevolucaoEfetiva(),
                    "multa", loc.getMultaCobrada(),
                    // total a pagar: se a locação já não foi paga, soma-se o valor da locação + multa
                    "totalAPagar", computeTotalAPagar(loc)
            ));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(404).body(Map.of("erro", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("erro", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao processar devolução"));
        }
    }

    // helper: tenta calcular total a pagar de forma genérica; ajuste conforme seu modelo (campo de pagamento)
    private Object computeTotalAPagar(Locacao loc) {
        try {
            // se loc.hasPagamento / isPago existir, adaptar; aqui assumimos método isPaga()
            boolean paga = false;
            try {
                // tentar chamar isPaga() se existir
                paga = (boolean) Locacao.class.getMethod("isPaga").invoke(loc);
            } catch (NoSuchMethodException ignored) {
                // tenta getPago()
                try {
                    paga = (boolean) Locacao.class.getMethod("getPago").invoke(loc);
                } catch (Exception ignored2) {
                    paga = false;
                }
            } catch (Exception e) {
                paga = false;
            }

            if (paga) {
                return loc.getMultaCobrada(); // somente multa pendente
            } else {
                // soma valor da locação + multa
                return loc.getValorCobrado().add(loc.getMultaCobrada() != null ? loc.getMultaCobrada() : java.math.BigDecimal.ZERO);
            }
        } catch (Exception e) {
            // fallback: não conseguir calcular, retorna null
            return null;
        }
    }
}