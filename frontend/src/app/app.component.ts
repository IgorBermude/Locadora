import { Component, OnInit } from '@angular/core';
import { ApiService, HelloResponse } from './api.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular + Spring Boot</h1>
    <button (click)="load()">Chamar Backend</button>
    <div *ngIf="loading">Carregando...</div>
    <pre *ngIf="error" style="color:red">{{ error }}</pre>
    <div *ngIf="data">
      <p><strong>Mensagem:</strong> {{ data.message }}</p>
      <p><strong>Timestamp:</strong> {{ data.timestamp }}</p>
    </div>
  `
})
export class AppComponent implements OnInit {
  data?: HelloResponse;
  loading = false;
  error?: string;
  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load(){
    this.loading = true;
    this.error = undefined;
    this.api.getHello().subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: (err) => { this.error = 'Falha ao chamar backend'; this.loading = false; console.error(err); }
    });
  }
}
