import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { DependenteService } from 'src/app/services/dependente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { Dependente } from 'src/app/models/dependente.model';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  selecionado: Cliente | null = null;
  clienteSelecionado: Cliente | null = null;

  // Dialogs
  displayDetalhes = false;
  displayConfirmarExclusao = false;

  // Estados
  carregando = false;
  carregandoTitulos = false;
  carregandoDependentes = false;

  // Dados - INICIALIZE AS VARIÁVEIS
  titulosCliente: any[] = [];
  dependentes: Dependente[] = [];

  constructor(
    private clienteService: ClienteService,
    private dependenteService: DependenteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.carregando = true;
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data || []; // GARANTIR QUE SEMPRE SEJA UM ARRAY
        this.carregando = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar clientes'
        });
        this.carregando = false;
      }
    });
  }

  // === DETALHES DO CLIENTE ===
  abrirDetalhes(cliente: Cliente) {
    this.selecionado = cliente;
    this.carregarTitulosCliente(cliente.idCliente!);
    this.carregarDependentes(cliente.idCliente!);
    this.displayDetalhes = true;
  }

  // CARREGAR DEPENDENTES DO SÓCIO
  carregarDependentes(idSocio: number) {
    this.carregandoDependentes = true;
    this.dependenteService.getAll().subscribe({
      next: (dependentes) => {
        // VERIFICAÇÃO DE SEGURANÇA
        if (dependentes && Array.isArray(dependentes)) {
          this.dependentes = dependentes.filter(dep =>
            (dep.clienteId === idSocio || dep.socioId === idSocio) && dep !== null
          ) || [];
        } else {
          this.dependentes = [];
        }
        this.carregandoDependentes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dependentes:', error);
        this.dependentes = []; // GARANTIR QUE SEJA UM ARRAY VAZIO EM CASO DE ERRO
        this.carregandoDependentes = false;
      }
    });
  }

  // MÉTODO PARA CONTAR DEPENDENTES COM VERIFICAÇÃO
  contarDependentes(idSocio: number): number {
    if (!this.dependentes || !Array.isArray(this.dependentes)) {
      return 0;
    }
    return this.dependentes.filter(dep =>
      dep && (dep.clienteId === idSocio || dep.socioId === idSocio)
    ).length;
  }

  carregarTitulosCliente(id: number) {
    this.carregandoTitulos = true;
    this.clienteService.getTitulos(id).subscribe({
      next: (titulos) => {
        this.titulosCliente = titulos || []; // GARANTIR QUE SEMPRE SEJA UM ARRAY
        this.carregandoTitulos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar títulos:', error);
        this.titulosCliente = []; // GARANTIR ARRAY VAZIO EM CASO DE ERRO
        this.carregandoTitulos = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao carregar títulos'
        });
      }
    });
  }

  // RESTANTE DOS MÉTODOS PERMANECE IGUAL...
  confirmarExcluir(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.displayConfirmarExclusao = true;
  }

  excluir() {
    if (!this.clienteSelecionado) return;

    this.clienteService.delete(this.clienteSelecionado.idCliente!).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.idCliente !== this.clienteSelecionado!.idCliente);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cliente excluído com sucesso'
        });
        this.displayConfirmarExclusao = false;
        this.clienteSelecionado = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao excluir cliente'
        });
      }
    });
  }

  desativar(cliente: Cliente) {
    console.log('Clicou em desativar:', cliente);

    this.confirmationService.confirm({
      message: `Tem certeza que deseja desativar o cliente <strong>${cliente.nome}</strong>?`,
      header: 'Confirmar Desativação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Usuário confirmou desativação do cliente:', cliente.idCliente);

        this.clienteService.desativar(cliente.idCliente!).subscribe({
          next: () => {
            console.log('Cliente desativado com sucesso:', cliente.idCliente);

            // SOLUÇÃO: CRIAR UM NOVO ARRAY COM OS OBJETOS ATUALIZADOS
            this.clientes = this.clientes.map(c => {
              if (c.idCliente === cliente.idCliente) {
                return { ...c, estahAtivo: false }; // NOVO OBJETO COM STATUS ATUALIZADO
              }
              return c;
            });

            console.log('Array atualizado:', this.clientes);

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente desativado com sucesso'
            });
          },
          error: (error) => {
            console.error('Erro ao desativar cliente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.message || 'Erro ao desativar cliente'
            });
          }
        });
      },
      reject: () => {
        console.log('Usuário cancelou desativação');
      }
    });
  }

  reativar(cliente: Cliente) {
    console.log('Clicou em reativar:', cliente);

    this.confirmationService.confirm({
      message: `Tem certeza que deseja reativar o cliente <strong>${cliente.nome}</strong>?`,
      header: 'Confirmar Reativação',
      icon: 'pi pi-check-circle',
      accept: () => {
        console.log('Usuário confirmou reativação do cliente:', cliente.idCliente);

        this.clienteService.reativar(cliente.idCliente!).subscribe({
          next: () => {
            console.log('Cliente reativado com sucesso:', cliente.idCliente);

            // SOLUÇÃO: CRIAR UM NOVO ARRAY COM OS OBJETOS ATUALIZADOS
            this.clientes = this.clientes.map(c => {
              if (c.idCliente === cliente.idCliente) {
                return { ...c, estahAtivo: true }; // NOVO OBJETO COM STATUS ATUALIZADO
              }
              return c;
            });

            console.log('Array atualizado:', this.clientes);

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente reativado com sucesso'
            });
          },
          error: (error) => {
            console.error('Erro ao reativar cliente:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.message || 'Erro ao reativar cliente'
            });
          }
        });
      },
      reject: () => {
        console.log('Usuário cancelou reativação');
      }
    });
  }
}