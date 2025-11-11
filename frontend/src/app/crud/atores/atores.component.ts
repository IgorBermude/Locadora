import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ator } from 'src/app/models/ator.model';
import { AtorService } from 'src/app/services/ator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-atores',
  templateUrl: './atores.component.html',
  styleUrls: ['./atores.component.css'],
  providers: [MessageService]
})
export class AtoresComponent implements OnInit {
  atores: Ator[] = [];
  atorForm!: FormGroup;
  displayDialog = false;
  editingAtor = false;

  constructor(
    private fb: FormBuilder,
    private atorService: AtorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // FormGroup com idAtor opcional
    this.atorForm = this.fb.group({
      idAtor: [null],
      nome: ['', Validators.required]
    });

    this.carregarAtores();
  }

  // Carrega todos os atores
  carregarAtores() {
    this.atorService.getAll().subscribe({
      next: (dados) => this.atores = dados,
      error: () => this.showError('Erro ao carregar atores')
    });
  }

  // Abre o diálogo de criação/edição
  abrirDialog(ator?: Ator) {
    this.displayDialog = true;
    this.editingAtor = !!ator;

    if (ator) {
      // Editando ator existente
      this.atorForm.setValue({
        idAtor: ator.idAtor || null,
        nome: ator.nome
      });
    } else {
      // Novo ator
      this.atorForm.reset({ idAtor: null, nome: '' });
    }
  }

  // Salva ator (cria ou atualiza)
  salvar() {
    if (this.atorForm.invalid) {
      this.showError('Preencha o nome do ator.');
      return;
    }

    const formValue = this.atorForm.value;
    const ator: Ator = { nome: formValue.nome }; // envia só o nome

    if (formValue.idAtor) {
      // Atualização
      ator.idAtor = formValue.idAtor;
      this.atorService.update(ator).subscribe({
        next: (res) => {
          this.showSuccess('Ator atualizado com sucesso!');
          this.displayDialog = false;
          this.carregarAtores();
        },
        error: (err) => {
          console.error('Erro ao atualizar ator:', err);
          this.showError('Erro ao atualizar ator.');
        }
      });
    } else {
      // Criação
      this.atorService.create(ator).subscribe({
        next: (res) => {
          this.showSuccess('Ator criado com sucesso!');
          this.displayDialog = false;
          this.carregarAtores();
        },
        error: (err) => {
          console.error('Erro ao criar ator:', err);
          this.showError('Erro ao criar ator.');
        }
      });
    }
  }

  // Exclui ator
  excluir(ator: Ator) {
    if (!ator.idAtor) return;
    this.atorService.delete(ator.idAtor).subscribe({
      next: () => {
        this.showSuccess('Ator excluído com sucesso!');
        this.carregarAtores();
      },
      error: () => this.showError('Erro ao excluir ator')
    });
  }

  // Mensagem de sucesso
  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  // Mensagem de erro
  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }
}
