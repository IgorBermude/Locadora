package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SocioService {
    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    public SocioService(ClienteRepository clienteRepository, ClienteService clienteService) {
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
    }

    private int gerarNumeroInscricao() {
        // geração simples: count + 1 (ajuste conforme regra real)
        return (int) (clienteService.contarClientes() + 1);
    }

    @Transactional
    public Socio inscreverSocio(Socio socio, List<Dependente> dependentes) {
        if (socio == null || socio.getNome() == null || socio.getNome().isBlank() || socio.getDtNascimento() == null || socio.getSexo() == null || socio.getSexo().isBlank() || socio.getCpf() == null || socio.getCpf().isBlank()) {
            throw new IllegalArgumentException("Dados do sócio inválidos");
        }
        socio.setNumInscricao(gerarNumeroInscricao());
        socio.setEstahAtivo(true);
        Socio salvo = (Socio) clienteRepository.save(socio);

        if (dependentes != null) {
            for (Dependente d : dependentes) {
                incluirDependente(salvo.getIdCliente(), d);
            }
        }
        return salvo;
    }

    @Transactional
    public void incluirDependente(Long socioId, Dependente dependente) {
        if (dependente == null || dependente.getNome() == null || dependente.getNome().isBlank() || dependente.getDtNascimento() == null || dependente.getSexo() == null || dependente.getSexo().isBlank()) {
            throw new IllegalArgumentException("Dados do dependente inválidos");
        }
        Socio socio = clienteRepository.findById(socioId)
                .filter(c -> c instanceof Socio)
                .map(c -> (Socio) c)
                .orElseThrow(() -> new IllegalArgumentException("Sócio não encontrado"));

        long ativos = socio.getDependentes() == null ? 0 : socio.getDependentes().stream().filter(Dependente::isEstahAtivo).count();
        if (ativos >= 3) {
            throw new DataIntegrityViolationException("Sócio já possui 3 dependentes ativos");
        }

        dependente.setNumInscricao(gerarNumeroInscricao());
        dependente.setEstahAtivo(true);
        dependente.setSocio(socio);
        Dependente salvo = (Dependente) clienteRepository.save(dependente);

        // atualizar lista em memória opcional
        if (socio.getDependentes() != null) {
            socio.getDependentes().add(salvo);
        }
    }

    @Transactional
    public void excluirSocio(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        if (cliente.getLocacaoes() != null && !cliente.getLocacaoes().isEmpty()) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de um cliente que possui locações");
        }
        if (cliente instanceof Socio) {
            Socio s = (Socio) cliente;
            if (s.getDependentes() != null) {
                // verificar se dependentes possuem locações
                for (Dependente d : s.getDependentes()) {
                    if (d.getLocacaoes() != null && !d.getLocacaoes().isEmpty()) {
                        throw new DataIntegrityViolationException("Não é permitida a exclusão: dependente possui locações");
                    }
                }
                // excluir dependentes
                s.getDependentes().forEach(clienteRepository::delete);
            }
            clienteRepository.delete(s);
        } else {
            // para dependentes ou cliente genérico, delegar a regra básica
            clienteRepository.delete(cliente);
        }
    }
}

