import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(private router: Router) {}

  acessarComoCliente() {
    this.router.navigate(['/cliente']);
  }

  acessarComoFuncionario() {
    this.router.navigate(['/funcionario']);
  }
}