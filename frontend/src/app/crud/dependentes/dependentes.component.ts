import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dependente } from 'src/app/models/dependente.model';
import { Socio } from 'src/app/models/socio.model';

@Component({
  selector: 'app-dependentes',
  templateUrl: './dependentes.component.html',
  styleUrls: ['./dependentes.component.css']
})
export class DependentesComponent implements OnInit {
  dependentes: Dependente[] = [];
  socios: Socio[] = [];
  dependenteForm!: FormGroup;
  displayDialog: boolean = false;
  editingDependente: boolean = false;
  dependenteSelecionado!: Dependente | null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.carregarSocios();
    this.carregarDependentes();

    this.dependenteForm = this.fb.group({
      idDependente: [null],
      nome: ['', Validators.required],
      socioId: [null, Validators.required]
    });
  }

  carregarSocios() {
    this.socios = [];
  }

  carregarDependentes() {
    this.dependentes = [];
  }

  abrirDialog(dependente?: Dependente) {
    if (dependente) {
      this.editingDependente = true;
      this.dependenteSelecionado = dependente;
      this.dependenteForm.patchValue(dependente);
    } else {
      this.editingDependente = false;
      this.dependenteSelecionado = null;
      this.dependenteForm.reset();
    }
    this.displayDialog = true;
  }

  salvar() {
    const formValue = this.dependenteForm.value;
    if (this.editingDependente && this.dependenteSelecionado) {
      const index = this.dependentes.findIndex(d => d.idDependente === this.dependenteSelecionado?.idDependente);
      this.dependentes[index] = formValue;
    } else {
      formValue.idDependente = this.dependentes.length + 1;
      this.dependentes.push(formValue);
    }
    this.displayDialog = false;
  }

  excluir(dependente: Dependente) {
    this.dependentes = this.dependentes.filter(d => d.idDependente !== dependente.idDependente);
  }

  getNomeSocio(idSocio: number): string {
    return this.socios.find(s => s.idSocio === idSocio)?.nome || '—';
  }
}
