package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.*;
import com.example.DevWeb2.repository.LocacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

@Service
public class LocacaoService {
    private final LocacaoRepository repository;

    public LocacaoService(LocacaoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void efetuarNovaLocacao(Item item, Cliente cliente) {
        if (item == null || cliente == null) {
            throw new IllegalArgumentException("Item e cliente são obrigatórios");
        }

        // Verifica se cliente está em débito
        if (cliente.getLocacaoes() != null) {
            boolean emDebito = cliente.getLocacaoes().stream().anyMatch(l ->
                    (l.getMultaCobrada().compareTo(BigDecimal.ZERO) > 0) || (l.getDtDevolucaoPrevista() != null && l.getDtDevolucaoEfetiva() == null && l.getDtDevolucaoPrevista().isBefore(LocalDate.now()))
            );
            if (emDebito) {
                throw new IllegalStateException("Cliente em débito não pode efetuar nova locação");
            }
        }

        // Obtém classe do título para calcular valor e prazo
        if (item.getTitulo() == null || item.getTitulo().getClasse() == null) {
            throw new IllegalArgumentException("Item sem título/classe válida");
        }

        Classe classe = item.getTitulo().getClasse(); // ajustado para pegar a classe
        // supondo que classe fornece getValor() : float e getPrazoEmDias() : int
        BigDecimal valor = classe.getValor();

        LocalDate hoje = LocalDate.now();
        LocalDate dtDevolucaoPrevista = classe.getDataDevolucao();

        // Regra de integridade: não pode haver outra locação vigente sobrepondo o mesmo item
        List<Locacao> todas = repository.findAll();
        boolean conflito = todas.stream().anyMatch(l -> isSameItem(l, item) && isOverlapping(l.getDtLocacao(), l.getDtDevolucaoPrevista(), hoje, dtDevolucaoPrevista));
        if (conflito) {
            throw new IllegalStateException("Não há disponibilidade para este item na data solicitada (conflito com outra locação)");
        }

        Locacao nova = new Locacao();
        nova.setDtLocacao(hoje);
        nova.setDtDevolucaoPrevista(dtDevolucaoPrevista);
        nova.setValorCobrado(valor);
        nova.setMultaCobrada(BigDecimal.ZERO);
        nova.setCliente(cliente);
        nova.setItem(item);

        repository.save(nova);
    }

    @Transactional
    public Locacao alterarLocacao(Locacao locacao) {
        if (locacao == null || locacao.getIdLocacao() == null) {
            throw new IllegalArgumentException("Locação inválida para alteração");
        }

        Locacao existente = repository.findById(locacao.getIdLocacao())
                .orElseThrow(() -> new IllegalArgumentException("Locação não encontrada"));

        // Validações de data
        if (locacao.getDtLocacao() == null) {
            throw new IllegalArgumentException("Data de locação é obrigatória");
        }
        if (locacao.getDtDevolucaoPrevista() == null) {
            throw new IllegalArgumentException("Data de devolução prevista é obrigatória");
        }
        if (!locacao.getDtDevolucaoPrevista().isAfter(locacao.getDtLocacao())) {
            throw new IllegalArgumentException("Data de devolução prevista deve ser maior que a data de locação");
        }
        if (locacao.getDtDevolucaoEfetiva() != null && locacao.getDtDevolucaoEfetiva().isBefore(locacao.getDtLocacao())) {
            throw new IllegalArgumentException("Data de devolução efetiva deve ser maior ou igual à data de locação");
        }

        // Integridade: não permitir overlap com outras locações do mesmo item (exceto ela mesma)
        Item item = locacao.getItem() != null ? locacao.getItem() : existente.getItem();
        LocalDate novoInicio = locacao.getDtLocacao();
        LocalDate novoFim = locacao.getDtDevolucaoPrevista();
        List<Locacao> todas = repository.findAll();
        boolean conflito = todas.stream()
                .filter(l -> !Objects.equals(l.getIdLocacao(), existente.getIdLocacao()))
                .anyMatch(l -> isSameItem(l, item) && isOverlapping(l.getDtLocacao(), l.getDtDevolucaoPrevista(), novoInicio, novoFim));
        if (conflito) {
            throw new IllegalStateException("Alteração resultaria em conflito de disponibilidade do item");
        }

        // atualizar campos permitidos
        existente.setDtLocacao(locacao.getDtLocacao());
        existente.setDtDevolucaoPrevista(locacao.getDtDevolucaoPrevista());
        existente.setDtDevolucaoEfetiva(locacao.getDtDevolucaoEfetiva());
        existente.setValorCobrado(locacao.getValorCobrado());
        existente.setMultaCobrada(locacao.getMultaCobrada());
        existente.setCliente(locacao.getCliente() != null ? locacao.getCliente() : existente.getCliente());
        existente.setItem(item != null ? item : existente.getItem());

        return repository.save(existente);
    }

    @Transactional
    public void cancelarLocacao(Long idLocacao, boolean confirmacao) {
        if (!confirmacao) {
            throw new IllegalStateException("Confirmação de cancelamento é necessária");
        }
        Locacao l = repository.findById(idLocacao).orElseThrow(() -> new IllegalArgumentException("Locação não encontrada"));

        if (l.getDtDevolucaoEfetiva() != null) {
            throw new IllegalStateException("Locação paga/fechada não pode ser cancelada");
        }

        // permitir cancelar (excluir)
        repository.delete(l);
    }

    // helpers
    private boolean isSameItem(Locacao l, Item item) {
        return l.getItem() != null && item != null && l.getItem().getIdItem() != null && item.getIdItem() != null
                && l.getItem().getIdItem().equals(item.getIdItem());
    }

    private boolean isOverlapping(LocalDate aStart, LocalDate aEnd, LocalDate bStart, LocalDate bEnd) {
        if (aStart == null || aEnd == null || bStart == null || bEnd == null) return false;
        // considerar intervalos inclusivos: overlap se aStart <= bEnd && bStart <= aEnd
        return !aStart.isAfter(bEnd) && !bStart.isAfter(aEnd);
    }

    public List<Locacao> listar() {
        return repository.findAll();
    }


    public Optional<Locacao> pesquisar(Long id) {
        return repository.findById(id);
    }

    public Locacao processarDevolucao(String numeroSerie) {
        List<Locacao> locacoesAtivas = repository.findByItem_NumeroSerieAndDtDevolucaoEfetivaIsNull(numeroSerie);
        if (locacoesAtivas.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma locação ativa encontrada para o item com número de série: " + numeroSerie);
        }
        Locacao locacao = locacoesAtivas.get(0); // considerar a primeira locação ativa encontrada

        LocalDate hoje = LocalDate.now();
        locacao.setDtDevolucaoEfetiva(hoje);

        // Calcular multa se houver atraso
        if (hoje.isAfter(locacao.getDtDevolucaoPrevista())) {
            long diasAtraso = java.time.temporal.ChronoUnit.DAYS.between(locacao.getDtDevolucaoPrevista(), hoje);
            BigDecimal multaDiaria = BigDecimal.valueOf(2.0F); // valor fixo de multa diária, pode ser ajustado conforme regras de negócio
            BigDecimal multaTotal = multaDiaria
                    .multiply(BigDecimal.valueOf(diasAtraso));
            locacao.setMultaCobrada(multaTotal);
        } else {
            locacao.setMultaCobrada(BigDecimal.ZERO);
        }

        return repository.save(locacao);
    }

    /**
     * Registra a devolução de uma fita a partir do número de série do item.
     * - encontra a locação vigente (sem dtDevolucaoEfetiva) para o item
     * - valida data de devolução (hoje >= dtLocacao)
     * - calcula multa (dias em atraso * multaDiaria da classe do título) — ajustar nomes conforme seu modelo
     * - persiste dtDevolucaoEfetiva e multa na locação
     *
     * Retorna a locação atualizada.
     */
    @Transactional
    public Locacao registrarDevolucaoPorNumeroSerie(String numeroSerie) {
        Optional<Locacao> opt = repository.findVigenteByItemNumeroSerie(numeroSerie);
        if (opt.isEmpty()) {
            throw new NoSuchElementException("Item não possui uma locação vigente.");
        }

        Locacao loc = opt.get();
        LocalDate hoje = LocalDate.now();

        // valida integridade: data de devolução deve ser >= data de locação
        if (hoje.isBefore(loc.getDtLocacao())) {
            throw new IllegalArgumentException("Data de devolução (" + hoje + ") é anterior à data de locação.");
        }

        // calcula dias de atraso: se previsto for null, considera 0
        LocalDate prevista = loc.getDtDevolucaoPrevista();
        long diasAtraso = 0;
        if (prevista != null) {
            diasAtraso = ChronoUnit.DAYS.between(prevista, hoje);
            if (diasAtraso < 0) diasAtraso = 0;
        }

        // O valor a ser pago é dado pela soma do valor da locação (caso não tenha sido paga
        // ainda) com o valor da multa.
        // substitua pela operação segura com BigDecimal
        BigDecimal multaTotal = (loc.getValorCobrado() == null ? BigDecimal.ZERO : loc.getValorCobrado())
                .add(loc.getMultaCobrada() == null ? BigDecimal.ZERO : loc.getMultaCobrada());

        // registra devolução
        loc.setDtDevolucaoEfetiva(hoje);
        // Ajuste o setter abaixo se o campo for diferente (ex.: setValorMulta)
        loc.setMultaCobrada(multaTotal);

        // Persistir
        repository.save(loc);

        return loc;
    }
}
