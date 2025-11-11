import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diretor } from 'src/app/models/diretor.model';
import { DiretorService } from 'src/app/services/diretor.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-diretores',
  templateUrl: './diretores.component.html',
  styleUrls: ['./diretores.component.css'],
  providers: [MessageService] // manter só o MessageService aqui
})
export class DiretoresComponent implements OnInit {
  diretores: Diretor[] = [];
  diretorForm!: FormGroup;
  displayDialog = false;
  editing: boolean = false;

  colunas = [
    { field: 'nome', header: 'Nome' }
  ];

  constructor(
    private fb: FormBuilder,
    private diretorService: DiretorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.diretorForm = this.fb.group({
      idDiretor: [null],
      nome: ['', Validators.required],
      titulos: [[]]
    });
    this.carregarDiretores();
  }

  carregarDiretores() {
    this.diretorService.getDiretores().subscribe({
      next: (dados) => {
        console.log('Diretores recebidos:', dados);
        this.diretores = dados;
      },
      error: (err) => {
        console.error('Erro ao carregar diretores:', err);
        this.showError('Erro ao carregar diretores');
      }
    });
  }

  abrirDialog(diretor?: Diretor) {
    this.displayDialog = true;
    this.editing = !!diretor;

    if (diretor) {
      this.diretorForm.setValue({
        idDiretor: diretor.idDiretor,
        nome: diretor.nome,
        titulos: diretor.titulos || []
      });
    } else {
      this.diretorForm.reset({ idDiretor: null, nome: '', titulos: [] });
    }
  }

  salvar() {
    if (this.diretorForm.invalid) {
      this.showError('Preencha o nome do diretor.');
      return;
    }

    const diretor: Diretor = this.diretorForm.value;

    const operacao = this.editing
      ? this.diretorService.updateDiretor(diretor)
      : this.diretorService.addDiretor(diretor);

    operacao.subscribe({
      next: () => {
        this.showSuccess(`Diretor ${this.editing ? 'atualizado' : 'adicionado'} com sucesso!`);
        this.displayDialog = false;
        this.carregarDiretores();
      },
      error: (err) => {
        console.error('Erro ao salvar diretor:', err);
        this.showError('Erro ao salvar diretor');
      }
    });
  }

  excluir(diretor: Diretor) {
    if (!diretor.idDiretor) return;
    if (confirm("Excluir diretor?")) {
      this.diretorService.deleteDiretor(diretor.idDiretor).subscribe({
        next: () => {
          this.showSuccess('Diretor excluído com sucesso!');
          this.carregarDiretores();
        },
        error: () => this.showError('Erro ao excluir diretor')
      });
    }
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }
}
