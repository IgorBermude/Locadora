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
  locacaoSelecionadaParaExcluir: Locacao | null = null;
  displayConfirmacaoCancelamento: boolean = false;
  motivoCancelamento: string = '';
  locacaoParaCancelar: Locacao | null = null;
  carregando: boolean = false;
  carregandoClientes: boolean = false;
  carregandoItens: boolean = false;
  displayDevolucaoDialog: boolean = false;
  numeroSerieDevolucao: string = '';
  devolucaoCarregando: boolean = false;
  resultadoDevolucao: any = null;

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
        this.clientes = clientes;
        this.carregandoClientes = false;
        this.enriquecerLocacoes();
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
        this.itens = itens;
        this.carregandoItens = false;
        this.enriquecerLocacoes();
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
        this.locacoes = locacoes;
        this.enriquecerLocacoes();
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
    if (this.clientes.length > 0 && this.itens.length > 0) {
      this.locacoes = this.locacoes
        .filter(locacao => locacao !== null && locacao !== undefined)
        .map(l => ({
          ...l,
          cliente: this.clientes.find(c => c.idCliente === l.clienteId),
          item: this.itens.find(i => i.idItem === l.itemId)
        }));
    }
  }

  abrirDialog(locacao?: Locacao) {
    if (locacao) {
      this.editingLocacao = true;
      this.locacaoSelecionada = locacao;
      this.locacaoForm.patchValue({
        idLocacao: locacao.idLocacao,
        cliente: this.clientes.find(c => c.idCliente === locacao.clienteId),
        item: this.itens.find(i => i.idItem === locacao.itemId),
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

  abrirDialogDevolucao() {
    this.numeroSerieDevolucao = '';
    this.resultadoDevolucao = null;
    this.displayDevolucaoDialog = true;
  }

  registrarDevolucao() {
    if (!this.numeroSerieDevolucao || this.numeroSerieDevolucao.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe o número de série do item',
        life: 3000
      });
      return;
    }

    this.devolucaoCarregando = true;
    this.resultadoDevolucao = null;

    this.locacaoService.registrarDevolucao(this.numeroSerieDevolucao.trim()).subscribe({
      next: (resultado) => {
        console.log('✅ Devolução registrada com sucesso:', resultado);
        this.resultadoDevolucao = resultado;
        this.devolucaoCarregando = false;

        // Recarrega as locações para atualizar a tabela
        this.carregarLocacoes();

        this.messageService.add({
          severity: 'success',
          summary: 'Devolução Registrada',
          detail: 'Devolução processada com sucesso',
          life: 5000
        });
      },
      error: (error) => {
        console.error('❌ Erro ao registrar devolução:', error);
        this.devolucaoCarregando = false;

        let mensagem = 'Erro ao processar devolução';
        if (error.status === 404) {
          mensagem = error.error?.erro || 'Item não encontrado ou não está locado';
        } else if (error.status === 400) {
          mensagem = error.error?.erro || 'Dados inválidos para devolução';
        } else if (error.message) {
          mensagem = error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro na Devolução',
          detail: mensagem,
          life: 5000
        });
      }
    });
  }

  fecharDialogDevolucao() {
    this.displayDevolucaoDialog = false;
    this.numeroSerieDevolucao = '';
    this.resultadoDevolucao = null;
  }

  salvar() {
    if (this.locacaoForm.invalid) {
      this.marcarCamposComoSujos();
      return;
    }

    const formValue = this.locacaoForm.getRawValue();
    const clienteId = formValue.cliente?.idCliente || formValue.cliente;
    const itemId = formValue.item?.idItem || formValue.item;

    const locacaoData: any = {
      idLocacao: formValue.idLocacao,
      dataLocacao: formValue.dtLocacao,
      dataDevolucao: formValue.dtDevolucaoPrevista,
      clienteId: clienteId,
      itemId: itemId
    };

    const operacao = this.editingLocacao
      ? this.locacaoService.update(locacaoData)
      : this.locacaoService.create(locacaoData);

    operacao.subscribe({
      next: (locacaoSalva) => {
        console.log('✅ Locação salva com sucesso:', locacaoSalva);

        if (!this.editingLocacao) {
          this.carregarLocacoes();
        } else {
          if (locacaoSalva) {
            const index = this.locacoes.findIndex(l => l.idLocacao === locacaoSalva.idLocacao);
            if (index !== -1) {
              this.locacoes[index] = locacaoSalva;
              this.enriquecerLocacoes();
            }
          }
        }

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
          detail: error.message || `Erro ao ${this.editingLocacao ? 'atualizar' : 'criar'} locação`
        });
      }
    });
  }

  excluir(locacao: Locacao) {
    if (!locacao.idLocacao) return;

    this.locacaoSelecionadaParaExcluir = locacao;

    this.messageService.clear();
    this.messageService.add({
      key: 'confirmacaoExclusao',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmar cancelamento',
      detail: `Tem certeza que deseja cancelar a locação ${locacao.idLocacao} do cliente ${locacao.cliente?.nome || 'N/A'}? Esta ação requer confirmação.`,
      closable: false
    });
  }

  confirmarExclusao() {
    const locacao = this.locacaoSelecionadaParaExcluir;

    if (!locacao || !locacao.idLocacao) {
      this.messageService.clear('confirmacaoExclusao');
      return;
    }

    this.messageService.clear('confirmacaoExclusao');

    this.locacaoService.delete(locacao.idLocacao, true).subscribe({
      next: () => {
        this.locacoes = this.locacoes.filter(l => l.idLocacao !== locacao.idLocacao);
        this.enriquecerLocacoes();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Locação cancelada com sucesso'
        });
        this.locacaoSelecionadaParaExcluir = null;
      },
      error: (error) => {
        console.error('Erro ao cancelar locação:', error);

        let mensagemErro = 'Erro ao cancelar locação';

        if (error.status === 409) {
          if (error.error && error.error.erro) {
            mensagemErro = error.error.erro;
          } else if (error.message) {
            mensagemErro = error.message;
          }

          this.abrirDialogoMotivoCancelamento(locacao);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagemErro,
            life: 5000
          });
        }

        this.locacaoSelecionadaParaExcluir = null;
      }
    });
  }

  abrirDialogoMotivoCancelamento(locacao: Locacao) {
    this.locacaoParaCancelar = locacao;
    this.motivoCancelamento = '';
    this.displayConfirmacaoCancelamento = true;
  }

  confirmarCancelamentoComMotivo() {
    if (!this.locacaoParaCancelar?.idLocacao) return;

    this.locacaoService.delete(this.locacaoParaCancelar.idLocacao, true).subscribe({
      next: () => {
        this.locacoes = this.locacoes.filter(l => l.idLocacao !== this.locacaoParaCancelar?.idLocacao);
        this.enriquecerLocacoes();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Locação cancelada com sucesso'
        });
        this.fecharDialogoMotivoCancelamento();
      },
      error: (error) => {
        console.error('Erro ao cancelar com motivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao cancelar locação'
        });
        this.fecharDialogoMotivoCancelamento();
      }
    });
  }

  fecharDialogoMotivoCancelamento() {
    this.displayConfirmacaoCancelamento = false;
    this.locacaoParaCancelar = null;
    this.motivoCancelamento = '';
  }

  rejeitarExclusao() {
    this.messageService.clear('confirmacaoExclusao');
    this.locacaoSelecionadaParaExcluir = null;
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Operação de cancelamento cancelada',
      life: 3000
    });
  }

  isAtrasado(locacao: Locacao): boolean {
    if (locacao.dataDevolucaoEfetiva) {
      return false; // Já foi devolvido
    }

    const hoje = new Date();
    const dataDevolucaoPrevista = new Date(locacao.dataDevolucao);

    return hoje > dataDevolucaoPrevista;
  }

  private marcarCamposComoSujos() {
    Object.keys(this.locacaoForm.controls).forEach(key => {
      this.locacaoForm.get(key)?.markAsDirty();
    });
  }

  formatarValor(valor: any): string {
    if (valor === null || valor === undefined) return '0.00';

    const num = typeof valor === 'string' ? parseFloat(valor) : valor;
    return num.toFixed(2);
  }
}