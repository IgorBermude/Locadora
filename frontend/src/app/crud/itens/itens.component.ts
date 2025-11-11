import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemDTO } from 'src/app/models/itemDTO.model';
import { ItemService } from 'src/app/services/item.service';
import { TituloService } from 'src/app/services/titulo.service';
import { Titulo } from 'src/app/models/titulo.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css'],
  providers: [MessageService]
})
export class ItensComponent implements OnInit {
  itens: ItemDTO[] = [];
  titulos: Titulo[] = [];
  itemForm!: FormGroup;
  displayDialog = false;
  updateItem = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private tituloService: TituloService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      idItem: [null],
      numeroSerie: ['', Validators.required],
      tipoItem: ['', Validators.required],
      dataAquisicao: ['', Validators.required],
      tituloId: [null, Validators.required]
    });

    this.carregarItens();
    this.carregarTitulos();
  }

  carregarItens() {
    this.itemService.getAll().subscribe({
      next: (dados) => (this.itens = dados),
      error: () => this.showError('Erro ao carregar itens')
    });
  }

  carregarTitulos() {
    this.tituloService.getTitulos().subscribe({
      next: (dados) => (this.titulos = dados),
      error: () => this.showError('Erro ao carregar títulos')
    });
  }

  abrirDialog(item?: ItemDTO) {
    this.updateItem = !!item;
    this.displayDialog = true;
    this.itemForm.reset(item || {});
  }

  salvar() {
    const item = this.itemForm.value;
    const operacao = this.updateItem
      ? this.itemService.update(item.idItem, item)
      : this.itemService.create(item);

    operacao.subscribe({
      next: () => {
        this.showSuccess('Item salvo com sucesso!');
        this.displayDialog = false;
        this.carregarItens();
      },
      error: () => this.showError('Erro ao salvar item')
    });
  }

  excluir(item: ItemDTO) {
    if (!item.idItem) return;
    this.itemService.delete(item.idItem).subscribe({
      next: () => {
        this.showSuccess('Item excluído com sucesso!');
        this.carregarItens();
      },
      error: () => this.showError('Erro ao excluir item')
    });
  }

  getNomeTitulo(tituloId: number) {
    const titulo = this.titulos.find(t => t.idTitulo === tituloId);
    return titulo ? titulo.nome : '';
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }
}
