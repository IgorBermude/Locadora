import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Locacao } from 'src/app/models/locacao.model';
import { Cliente } from 'src/app/models/cliente.model';
import { ItemDTO } from 'src/app/models/itemDTO.model';
import { LocacaoService } from 'src/app/services/locacao.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-locacoes',
  templateUrl: './locacoes.component.html',
  styleUrls: ['./locacoes.component.css'],
  providers: [MessageService]
})
export class LocacoesComponent implements OnInit {
  locacoes: Locacao[] = [];
  clientes: Cliente[] = [];
  itens: ItemDTO[] = [];
  locacaoForm!: FormGroup;
  displayDialog: boolean = false;
  editingLocacao: boolean = false;
  locacaoSelecionada: Locacao | null = null;
  carregando: boolean = false;
  carregandoClientes: boolean = false;
  carregandoItens: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locacaoService: LocacaoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarClientes();
    this.carregarItens();
    this.carregarLocacoes();
  }

  inicializarFormulario() {
    this.locacaoForm = this.fb.group({
      idLocacao: [null],
      cliente: [null, Validators.required], 
      item: [null, Validators.required],       
      dtLocacao: [new Date().toISOString().split('T')[0], Validators.required],
      dtDevolucaoPrevista: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  carregarClientes() {
    this.carregandoClientes = true;
    this.locacaoService.getClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes carregados:', clientes);
        this.clientes = clientes;
        this.carregandoClientes = false;
        this.enriquecerLocacoes(); // Atualiza após carregar clientes
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de clientes'
        });
        this.carregandoClientes = false;
      }
    });
  }

  carregarItens() {
    this.carregandoItens = true;
    this.locacaoService.getItens().subscribe({
      next: (itens) => {
        console.log('Itens carregados:', itens);
        this.itens = itens;
        this.carregandoItens = false;
        this.enriquecerLocacoes(); // Atualiza após carregar itens
      },
      error: (error) => {
        console.error('Erro ao carregar itens:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de itens'
        });
        this.carregandoItens = false;
      }
    });
  }

  carregarLocacoes() {
    this.carregando = true;

    this.locacaoService.getAll().subscribe({
      next: (locacoes) => {
        console.log('Locações carregadas:', locacoes);
        this.locacoes = locacoes;
        this.enriquecerLocacoes(); // Enriquecer com dados já carregados
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar locações:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar locações'
        });
        this.carregando = false;
      }
    });
  }

  enriquecerLocacoes() {
    // Só enriquece se já tiver clientes e itens carregados
    if (this.clientes.length > 0 && this.itens.length > 0) {
      this.locacoes = this.locacoes.map(l => ({
        ...l,
        cliente: this.clientes.find(c => c.idCliente === l.clienteId),
        item: this.itens.find(i => i.idItem === l.itemId)
      }));
      console.log("Locações enriquecidas → ", this.locacoes);
    }
  }

  abrirDialog(locacao?: Locacao) {
    if (locacao) {
      this.editingLocacao = true;
      this.locacaoSelecionada = locacao;
      this.locacaoForm.patchValue({
        idLocacao: locacao.idLocacao,
        cliente: this.clientes.find(c => c.idCliente === locacao.clienteId), // Envia objeto completo
        item: this.itens.find(i => i.idItem === locacao.itemId), // Envia objeto completo
        dtLocacao: new Date(locacao.dataLocacao).toISOString().split('T')[0],
        dtDevolucaoPrevista: new Date(locacao.dataDevolucao).toISOString().split('T')[0]
      });
    } else {
      this.editingLocacao = false;
      this.locacaoSelecionada = null;
      this.locacaoForm.reset({
        dtLocacao: new Date().toISOString().split('T')[0],
        dtDevolucaoPrevista: new Date().toISOString().split('T')[0]
      });
    }
    this.displayDialog = true;
  }

  salvar() {
    if (this.locacaoForm.invalid) {
      console.log('📍 Formulário inválido:', this.locacaoForm.errors);
      this.marcarCamposComoSujos();
      return;
    }

    const formValue = this.locacaoForm.getRawValue();

    console.log('📍 Valores do formulário:', formValue);
    console.log('📍 Cliente selecionado:', formValue.cliente);
    console.log('📍 Item selecionado:', formValue.item);

    // Extrai os IDs dos objetos selecionados
    const clienteId = formValue.cliente?.idCliente || formValue.cliente;
    const itemId = formValue.item?.idItem || formValue.item;

    const locacaoData: Locacao = {
      idLocacao: formValue.idLocacao,
      dataLocacao: formValue.dtLocacao,
      dataDevolucao: formValue.dtDevolucaoPrevista,
      clienteId: clienteId,
      itemId: itemId
    };

    console.log('📍 Dados da locação antes de enviar:', locacaoData);

    const operacao = this.editingLocacao
      ? this.locacaoService.update(locacaoData)
      : this.locacaoService.create(locacaoData);

    operacao.subscribe({
      next: (locacaoSalva) => {
        console.log('✅ Locação salva com sucesso:', locacaoSalva);

        // Atualiza a lista local
        if (this.editingLocacao) {
          const index = this.locacoes.findIndex(l => l.idLocacao === locacaoSalva.idLocacao);
          if (index !== -1) {
            this.locacoes[index] = locacaoSalva;
          }
        } else {
          this.locacoes.push(locacaoSalva);
        }
        
        // Re-enriquecer os dados
        this.enriquecerLocacoes();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Locação ${this.editingLocacao ? 'atualizada' : 'criada'} com sucesso`
        });

        this.displayDialog = false;
      },
      error: (error) => {
        console.error('❌ Erro ao salvar locação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || error.message || `Erro ao ${this.editingLocacao ? 'atualizar' : 'criar'} locação`
        });
      }
    });
  }

  excluir(locacao: Locacao) {
    if (!locacao.idLocacao) return;

    if (confirm(`Tem certeza que deseja excluir a locação ${locacao.idLocacao}?`)) {
      this.locacaoService.delete(locacao.idLocacao).subscribe({
        next: () => {
          this.locacoes = this.locacoes.filter(l => l.idLocacao !== locacao.idLocacao);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Locação excluída com sucesso'
          });
        },
        error: (error) => {
          console.error('Erro ao excluir locação:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error?.message || error.message || 'Erro ao excluir locação'
          });
        }
      });
    }
  }

  private marcarCamposComoSujos() {
    Object.keys(this.locacaoForm.controls).forEach(key => {
      this.locacaoForm.get(key)?.markAsDirty();
    });
  }
}