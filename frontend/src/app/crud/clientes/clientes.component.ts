import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  entidade = 'Cliente';
  lista: any[] = [];
  colunas = [
    { field: 'id', header: 'ID' },
    { field: 'nome', header: 'Nome' },
    { field: 'email', header: 'Email' }
  ];
  campos = [
    { name: 'nome', label: 'Nome', tipo: 'text' },
    { name: 'email', label: 'Email', tipo: 'text' }
  ];
  form: FormGroup;
  displayDialog = false;
  editing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({});
    this.campos.forEach(c => this.form.addControl(c.name, this.fb.control('', Validators.required)));
  }

  abrirDialog(item?: any) {
    this.editing = !!item;
    this.form.reset();
    if (item) this.form.patchValue(item);
    this.displayDialog = true;
  }

  salvar() {
    if (this.form.invalid) return;
    if (this.editing) {
      Object.assign(this.lista.find(i => i.id === this.form.value.id), this.form.value);
    } else {
      const novo = { ...this.form.value, id: this.lista.length + 1 };
      this.lista.push(novo);
    }
    this.displayDialog = false;
  }

  excluir(item: any) {
    this.lista = this.lista.filter(i => i.id !== item.id);
  }
}
