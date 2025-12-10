import { Component } from '@angular/core';

@Component({
  selector: 'app-funcionario-layout',
  templateUrl: './funcionario-layout.component.html',
  styleUrls: ['./funcionario-layout.component.css']
})
export class FuncionarioLayoutComponent {
  abrirMenu() {
    // Você pode emitir um evento para o AppComponent abrir o menu
    // Ou usar um serviço compartilhado
    // Por enquanto, vamos apenas scrollar para cima
    window.scrollTo(0, 0);
  }
}