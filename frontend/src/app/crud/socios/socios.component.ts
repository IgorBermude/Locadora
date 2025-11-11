import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socio } from 'src/app/models/socio.model';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  socios: Socio[] = [];
  socioForm!: FormGroup;
  displayDialog: boolean = false;
  editingSocio: boolean = false;
  socioSelecionado!: Socio | null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.carregarSocios();

    this.socioForm = this.fb.group({
      idSocio: [null],
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      tel: ['', Validators.required]
    });
  }

  carregarSocios() {
    this.socios = [];
  }

  abrirDialog(socio?: Socio) {
    if (socio) {
      this.editingSocio = true;
      this.socioSelecionado = socio;
      this.socioForm.patchValue(socio);
    } else {
      this.editingSocio = false;
      this.socioSelecionado = null;
      this.socioForm.reset();
    }
    this.displayDialog = true;
  }

  salvar() {
    const formValue = this.socioForm.value;
    if (this.editingSocio && this.socioSelecionado) {
      const index = this.socios.findIndex(s => s.idSocio === this.socioSelecionado?.idSocio);
      this.socios[index] = formValue;
    } else {
      formValue.idSocio = this.socios.length + 1;
      this.socios.push(formValue);
    }
    this.displayDialog = false;
  }

  excluir(socio: Socio) {
    this.socios = this.socios.filter(s => s.idSocio !== socio.idSocio);
  }
}
