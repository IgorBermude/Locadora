import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'; // Corrigir o import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visibleSidebar: boolean = false;
  showMenu: boolean = false;

  items: MenuItem[];

  constructor(private router: Router) {
    // CORREÇÃO: Use as rotas com /funcionario/
    this.items = [
      {
        label: 'Pessoas',
        icon: 'pi pi-users',
        items: [
          { label: 'Atores', icon: 'pi pi-user', command: () => this.navigateTo('atores') },
          { label: 'Diretores', icon: 'pi pi-user-edit', command: () => this.navigateTo('diretores') },
          { label: 'Clientes', icon: 'pi pi-id-card', command: () => this.navigateTo('clientes') },
          { label: 'Sócios', icon: 'pi pi-users', command: () => this.navigateTo('socios') },
          { label: 'Dependentes', icon: 'pi pi-users', command: () => this.navigateTo('dependentes') }
        ]
      },
      {
        label: 'Produtos / Filmes',
        icon: 'pi pi-film',
        items: [
          { label: 'Títulos', icon: 'pi pi-book', command: () => this.navigateTo('titulos') },
          { label: 'Itens', icon: 'pi pi-box', command: () => this.navigateTo('itens') },
          { label: 'Classes', icon: 'pi pi-list', command: () => this.navigateTo('classes') }
        ]
      },
      {
        label: 'Movimentações',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Locações', icon: 'pi pi-calendar-plus', command: () => this.navigateTo('locacoes') }
        ]
      }
    ];

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Mostrar menu apenas quando estiver na área do funcionário
        this.showMenu = event.url.includes('/funcionario');
        
        // Fechar sidebar quando mudar de rota (opcional)
        this.visibleSidebar = false;
      });
  }

  // Método para navegação - SEMPRE para /funcionario/[rota]
  navigateTo(route: string) {
    this.router.navigate([`/funcionario/${route}`]);
    this.visibleSidebar = false;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  // Método para abrir/fechar menu
  toggleMenu() {
    this.visibleSidebar = !this.visibleSidebar;
  }
}