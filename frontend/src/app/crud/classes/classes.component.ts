import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Classe } from 'src/app/models/classe.model';
import { ClasseService } from 'src/app/services/classe.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  providers: [MessageService]
})
export class ClassesComponent implements OnInit {
  classes: Classe[] = [];
  classeForm!: FormGroup;
  displayDialog = false;
  editingClasse = false; // <-- ADICIONE ESTA LINHA

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.classeForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      valor: [0, Validators.required],
      dataDevolucao: ['', Validators.required],
      titulos: [[]]
    });
    this.carregarClasses();
  }

  carregarClasses() {
    this.classeService.getAll().subscribe({
      next: (dados) => (this.classes = dados),
      error: () => this.showError('Erro ao carregar classes')
    });
  }

  abrirDialog(classe?: Classe) {
    this.displayDialog = true;
    this.editingClasse = !!classe; // true se estiver editando, false se for nova
    this.classeForm.reset(classe || {});
  }

  salvar() {
    const classe = this.classeForm.value;
    const operacao = this.editingClasse
      ? this.classeService.update(classe)
      : this.classeService.create(classe);

    operacao.subscribe({
      next: () => {
        this.showSuccess('Classe salva com sucesso!');
        this.displayDialog = false;
        this.carregarClasses();
      },
      error: () => this.showError('Erro ao salvar classe')
    });
  }

  excluir(classe: Classe) {
    this.classeService.delete(classe.idClasse!).subscribe({
      next: () => {
        this.showSuccess('Classe excluída com sucesso!');
        this.carregarClasses();
      },
      error: () => this.showError('Erro ao excluir classe')
    });
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }
}

