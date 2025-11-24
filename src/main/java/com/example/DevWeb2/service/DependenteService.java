package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.exception.NotFoundException;
import com.example.DevWeb2.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DependenteService {
    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    public DependenteService(ClienteRepository clienteRepository, ClienteService clienteService) {
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
    }

    private int gerarNumeroInscricao() {
        return (int) (clienteService.contarClientes() + 1);
    }

    public List<Dependente> listar() {
        return clienteRepository.findAll().stream()
                .filter(c -> c instanceof Dependente)
                .map(c -> (Dependente) c)
                .collect(Collectors.toList());
    }

    public Optional<Dependente> pesquisar(Long id) {
        return clienteRepository.findById(id)
                .filter(c -> c instanceof Dependente)
                .map(c -> (Dependente) c);
    }

    @Transactional
    public Dependente adicionar(Long clienteId, Dependente dependente) {
        if (dependente == null || dependente.getNome() == null || dependente.getNome().isBlank()
                || dependente.getDtNascimento() == null || dependente.getSexo() == null || dependente.getSexo().isBlank()) {
            throw new IllegalArgumentException("Dados do dependente inválidos");
        }

        Socio socio = clienteRepository.findById(clienteId)
                .filter(c -> c instanceof Socio)
                .map(c -> (Socio) c)
                .orElseThrow(() -> new NotFoundException("Sócio não encontrado"));

        long ativos = socio.getDependentes() == null ? 0 : socio.getDependentes().stream().filter(Dependente::isEstahAtivo).count();
        if (ativos >= 3) {
            throw new DataIntegrityViolationException("Sócio já possui 3 dependentes ativos");
        }

        dependente.setNumInscricao(gerarNumeroInscricao());
        dependente.setEstahAtivo(true);
        dependente.setSocio(socio);

        Dependente salvo = (Dependente) clienteRepository.save(dependente);

        if (socio.getDependentes() != null) {
            socio.getDependentes().add(salvo);
            clienteRepository.save(socio);
        }

        return salvo;
    }

    @Transactional
    public Dependente alterar(Dependente novo) {
        if (novo == null || novo.getIdCliente() == null) {
            throw new IllegalArgumentException("Dependente inválido para alteração");
        }

        Dependente existente = clienteRepository.findById(novo.getIdCliente())
                .filter(c -> c instanceof Dependente)
                .map(c -> (Dependente) c)
                .orElseThrow(() -> new NotFoundException("Dependente não encontrado"));

        return (Dependente) clienteRepository.save(novo);
    }

    @Transactional
    public void deletar(Long id) {
        Dependente dep = clienteRepository.findById(id)
                .filter(c -> c instanceof Dependente)
                .map(c -> (Dependente) c)
                .orElseThrow(() -> new NotFoundException("Dependente não encontrado"));

        if (dep.getLocacaoes() != null && !dep.getLocacaoes().isEmpty()) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de um cliente que possui locações");
        }

        Socio socio = dep.getSocio();
        clienteRepository.delete(dep);

        if (socio != null && socio.getDependentes() != null) {
            socio.getDependentes().removeIf(d -> d.getIdCliente() != null && d.getIdCliente().equals(id));
            clienteRepository.save(socio);
        }
    }
}
