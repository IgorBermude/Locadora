import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtorService } from '../services/ator.service';
import { Ator } from '../models/ator.model';

@Component({
  selector: 'app-ator',
  templateUrl: './ator.component.html'
})
export class AtorComponent implements OnInit {
  atores: Ator[] = [];
  atorForm: FormGroup;
  editId?: number;

  constructor(private atorService: AtorService, private fb: FormBuilder) {
    this.atorForm = this.fb.group({
      nome: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAtores();
  }

  loadAtores() {
    this.atorService.getAll().subscribe(data => this.atores = data);
  }

  save() {
    const ator: Ator = this.atorForm.value;

    if (this.editId) {
      ator.id= this.editId;
      this.atorService.update(ator).subscribe(() => {
        this.loadAtores();
        this.resetForm();
      });
    } else {
      this.atorService.create(ator).subscribe(() => {
        this.loadAtores();
        this.resetForm();
      });
    }
  }

  edit(ator: Ator) {
    this.editId = ator.id;
    this.atorForm.patchValue({ nome: ator.nome });
  }

  delete(id: number) {
    this.atorService.delete(id).subscribe(() => this.loadAtores());
  }

  resetForm() {
    this.editId = undefined;
    this.atorForm.reset();
  }
}
