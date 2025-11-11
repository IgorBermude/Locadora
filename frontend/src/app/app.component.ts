import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visibleSidebar: boolean = false;

  items: MenuItem[];

  constructor(private router: Router) {
    this.items = [
      {
        label: 'Pessoas',
        icon: 'pi pi-users',
        items: [
          { label: 'Atores', icon: 'pi pi-user', command: () => this.router.navigate(['/atores']) },
          { label: 'Diretores', icon: 'pi pi-user-edit', command: () => this.router.navigate(['/diretores']) },
          { label: 'Clientes', icon: 'pi pi-id-card', command: () => this.router.navigate(['/clientes']) },
          { label: 'Sócios', icon: 'pi pi-users', command: () => this.router.navigate(['/socios']) },
          { label: 'Dependentes', icon: 'pi pi-users', command: () => this.router.navigate(['/dependentes']) }
        ]
      },
      {
        label: 'Produtos / Filmes',
        icon: 'pi pi-film',
        items: [
          { label: 'Títulos', icon: 'pi pi-book', command: () => this.router.navigate(['/titulos']) },
          { label: 'Itens', icon: 'pi pi-box', command: () => this.router.navigate(['/itens']) },
          { label: 'Classes', icon: 'pi pi-list', command: () => this.router.navigate(['/classes']) }
        ]
      },
      {
        label: 'Movimentações',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Locações', icon: 'pi pi-calendar-plus', command: () => this.router.navigate(['/locacoes']) }
        ]
      }
    ];
  }
}
