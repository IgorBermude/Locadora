package com.example.DevWeb2.service;

import com.example.DevWeb2.domain.Cliente;
import com.example.DevWeb2.domain.Dependente;
import com.example.DevWeb2.domain.Socio;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.repository.ClienteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listar() { return repository.findAll(); }

    public Optional<Cliente> pesquisar(Long id) { return repository.findById(id); }

    public Cliente adicionar(Cliente c) {
        if (c == null || c.getNome() == null || c.getNome().isBlank() || c.getDtNascimento() == null || c.getSexo() == null || c.getSexo().isBlank()) {
            throw new IllegalArgumentException("Dados do cliente inválidos");
        }
        return repository.save(c);
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        if (cliente.getLocacaoes() != null && !cliente.getLocacaoes().isEmpty()) {
            throw new DataIntegrityViolationException("Não é permitida a exclusão de um cliente que possui locações");
        }
        repository.delete(cliente);
    }

    // método utilitário público para uso por outros services
    public long contarClientes() {
        return repository.count();
    }

    @Transactional
    public Cliente alterarCliente(Cliente novo) {
        if (novo == null || novo.getIdCliente() == null) {
            throw new IllegalArgumentException("Cliente inválido para alteração");
        }
        Cliente existente = repository.findById(novo.getIdCliente())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        return repository.save(novo);
    }

    @Transactional
    public void desativarCliente(Long id) {
        Cliente cliente = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        if(!cliente.isEstahAtivo()){
            throw new IllegalArgumentException("Cliente já está desativado");
        }
        if(cliente instanceof Socio){
            Socio s = (Socio) cliente;
            s.setEstahAtivo(false);
            // desativar dependentes
            if(s.getDependentes() != null){
                for(Dependente d : s.getDependentes()){
                    d.setEstahAtivo(false);
                    repository.save(d);
                }
            }
            repository.save(s);
        } else if (cliente instanceof Dependente) {
            Dependente d = (Dependente) cliente;
            d.setEstahAtivo(false);
            repository.save(d);
        } else {
            cliente.setEstahAtivo(false);
            repository.save(cliente);
        }
    }

    @Transactional
    public void reativarCliente(Long id) {
        Cliente cliente = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        if(cliente.isEstahAtivo()){
            throw new IllegalArgumentException("Cliente já está ativo");
        }
        if (cliente instanceof Socio) {
            Socio s = (Socio) cliente;
            s.setEstahAtivo(true);
            // reativar até 3 dependentes: priorizar por data de nascimento asc (exemplo)
            if (s.getDependentes() != null) {
                List<Dependente> inativos = s.getDependentes().stream()
                        .filter(d -> !d.isEstahAtivo())
                        .sorted(Comparator.comparing(Dependente::getDtNascimento))
                        .collect(Collectors.toList());

                long ativos = s.getDependentes().stream().filter(Dependente::isEstahAtivo).count();
                int slots = (int) Math.max(0, 3 - ativos);
                for (int i = 0; i < Math.min(slots, inativos.size()); i++) {
                    Dependente d = inativos.get(i);
                    d.setEstahAtivo(true);
                    repository.save(d);
                }
            }
            repository.save(s);
        } else if (cliente instanceof Dependente) {
            Dependente d = (Dependente) cliente;
            Socio socio = d.getSocio();
            if (socio == null) {
                throw new IllegalArgumentException("Dependente sem sócio associado");
            }
            long ativos = socio.getDependentes().stream().filter(Dependente::isEstahAtivo).count();
            if (ativos >= 3) {
                throw new DataIntegrityViolationException("Sócio já possui 3 dependentes ativos");
            }
            d.setEstahAtivo(true);
            repository.save(d);
        } else {
            cliente.setEstahAtivo(true);
            repository.save(cliente);
        }
    }

    public List<Titulo> consultarTitulosCliente(Long idCliente) {
        if (idCliente == null) {
            throw new IllegalArgumentException("ID do cliente não pode ser nulo");
        }
        Cliente cliente = repository.findById(idCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        return repository.consultarTitulosPorCliente(cliente.getIdCliente());
    }
}
