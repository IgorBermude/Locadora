package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.domain.Locacao;
import com.example.DevWeb2.service.LocacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/locacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class LocacaoController {
    private final LocacaoService service;

    public LocacaoController(LocacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Locacao> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Locacao> buscar(@PathVariable Long id) {
        return service.pesquisar(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Novo: criar locação (pode enviar um JSON com cliente e item embutidos)
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Locacao requisicao) {
        try {
            Item item = requisicao.getItem();
            var cliente = requisicao.getCliente();
            service.efetuarNovaLocacao(item, cliente);
            // não temos o id retornado pelo service atualmente, retornamos 201 Created sem Location
            return ResponseEntity.status(201).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Erro interno: " + ex.getMessage());
        }
    }

    // Novo: alterar locação
    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody Locacao requisicao) {
        try {
            if (requisicao.getIdLocacao() != null && !requisicao.getIdLocacao().equals(id)) {
                return ResponseEntity.badRequest().body("ID da requisição difere do ID do recurso");
            }
            requisicao.setIdLocacao(id);
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
