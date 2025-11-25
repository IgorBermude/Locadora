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
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarClientes();
    this.carregarItens();
    this.carregarLocacoes();
  }

  inicializarFormulario() {
    this.locacaoForm = this.fb.group({
      idLocacao: [null],
      cliente: [null, Validators.required], // Agora é o objeto cliente
      item: [null, Validators.required],    // Agora é o objeto item
      dtLocacao: ['', Validators.required],
      dtDevolucaoPrevista: ['', Validators.required]
    });
  }

  carregarClientes() {
    this.carregandoClientes = true;
    this.locacaoService.getClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes carregados:', clientes);
        this.clientes = clientes;
        this.carregandoClientes = false;
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

  abrirDialog(locacao?: Locacao) {
    if (locacao) {
      this.editingLocacao = true;
      this.locacaoSelecionada = locacao;
      this.locacaoForm.patchValue({
        idLocacao: locacao.idLocacao,
        cliente: locacao.cliente,
        item: locacao.item,
        dtLocacao: new Date(locacao.dtLocacao).toISOString().split('T')[0],
        dtDevolucaoPrevista: new Date(locacao.dtDevolucaoPrevista).toISOString().split('T')[0]
      });
    } else {
      this.editingLocacao = false;
      this.locacaoSelecionada = null;
      this.locacaoForm.reset({
        dtLocacao: new Date().toISOString().split('T')[0]
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

    // Preparar dados para o backend - objetos completos
    const locacaoData: Locacao = {
      idLocacao: formValue.idLocacao,
      dtLocacao: formValue.dtLocacao,
      dtDevolucaoPrevista: formValue.dtDevolucaoPrevista,
      valorCobrado: 0, // O backend pode calcular isso
      multaCobrada: 0,
      cliente: formValue.cliente, // Objeto completo
      item: formValue.item        // Objeto completo
    };

    console.log('📍 Dados da locação antes de enviar:', locacaoData);

    const operacao = this.editingLocacao 
      ? this.locacaoService.update(locacaoData)
      : this.locacaoService.create(locacaoData);

    operacao.subscribe({
      next: (locacaoSalva) => {
        console.log('✅ Locação salva com sucesso:', locacaoSalva);
        
        if (this.editingLocacao) {
          const index = this.locacoes.findIndex(l => l.idLocacao === locacaoSalva.idLocacao);
          this.locacoes[index] = locacaoSalva;
        } else {
          this.locacoes.push(locacaoSalva);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Locação ${this.editingLocacao ? 'atualizada' : 'criada'} com sucesso`
        });
        
        this.displayDialog = false;
        this.carregarLocacoes(); // Recarregar para garantir sincronização
      },
      error: (error) => {
        console.error('❌ Erro ao salvar locação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || `Erro ao ${this.editingLocacao ? 'atualizar' : 'criar'} locação`
        });
      }
    });
  }

  excluir(locacao: Locacao) {
    if (!locacao.idLocacao) return;

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
          detail: error.message || 'Erro ao excluir locação'
        });
      }
    });
  }

  private marcarCamposComoSujos() {
    Object.keys(this.locacaoForm.controls).forEach(key => {
      this.locacaoForm.get(key)?.markAsDirty();
    });
  }
}