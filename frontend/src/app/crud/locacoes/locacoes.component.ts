import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Locacao } from 'src/app/models/locacao.model';
import { Cliente } from 'src/app/models/cliente.model';
import { ItemDTO } from 'src/app/models/itemDTO.model';

@Component({
  selector: 'app-locacoes',
  templateUrl: './locacoes.component.html',
  styleUrls: ['./locacoes.component.css']
})
export class LocacoesComponent implements OnInit {
  locacoes: Locacao[] = [];
  clientes: Cliente[] = [];
  itens: ItemDTO[] = [];
  locacaoForm!: FormGroup;
  displayDialog: boolean = false;
  editingLocacao: boolean = false;
  locacaoSelecionada!: Locacao | null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarItens();
    this.carregarLocacoes();

    this.locacaoForm = this.fb.group({
      idLocacao: [null],
      clienteId: [null, Validators.required],
      itemId: [null, Validators.required],
      dataLocacao: ['', Validators.required],
      dataDevolucao: ['', Validators.required]
    });
  }

  carregarClientes() {
    this.clientes = [
      { idCliente: 1, nome: 'João Silva', numInscricao: 101, dtNascimento: '1990-05-10', sexo: 'M', estahAtivo: true },
      { idCliente: 2, nome: 'Maria Souza', numInscricao: 102, dtNascimento: '1985-02-22', sexo: 'F', estahAtivo: true }
    ];
  }

  carregarItens() {
    this.itens = [
      { idItem: 1, numeroSerie: 'SN12345', tipoItem: 'DVD', dataAquisicao: '2023-05-10', tituloId: 1 },
      { idItem: 2, numeroSerie: 'SN98765', tipoItem: 'Blu-ray', dataAquisicao: '2024-01-20', tituloId: 2 }
    ];
  }

  carregarLocacoes() {
    this.locacoes = [
      { idLocacao: 1, clienteId: 1, itemId: 1, dataLocacao: '2024-10-01', dataDevolucao: '2024-10-07' },
      { idLocacao: 2, clienteId: 2, itemId: 2, dataLocacao: '2024-11-05', dataDevolucao: '2024-11-10' }
    ];
  }

  abrirDialog(locacao?: Locacao) {
    if (locacao) {
      this.editingLocacao = true;
      this.locacaoSelecionada = locacao;
      this.locacaoForm.patchValue(locacao);
    } else {
      this.editingLocacao = false;
      this.locacaoSelecionada = null;
      this.locacaoForm.reset();
    }
    this.displayDialog = true;
  }

  salvar() {
    const formValue = this.locacaoForm.value;
    if (this.editingLocacao && this.locacaoSelecionada) {
      const index = this.locacoes.findIndex(l => l.idLocacao === this.locacaoSelecionada?.idLocacao);
      this.locacoes[index] = formValue;
    } else {
      formValue.idLocacao = this.locacoes.length + 1;
      this.locacoes.push(formValue);
    }
    this.displayDialog = false;
  }

  excluir(locacao: Locacao) {
    this.locacoes = this.locacoes.filter(l => l.idLocacao !== locacao.idLocacao);
  }

  getNomeCliente(id: number): string {
    return this.clientes.find(c => c.idCliente === id)?.nome || '—';
  }

  getItemSerie(id: number): string {
    return this.itens.find(i => i.idItem === id)?.numeroSerie || '—';
  }
}
