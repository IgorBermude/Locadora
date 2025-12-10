import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Titulo } from 'src/app/models/titulo.model';
import { TituloService } from 'src/app/services/titulo.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.css'],
  providers: [MessageService]
})
export class ClienteConsultaComponent implements OnInit {
  tipoConsulta: string = 'nome';
  filtroNome: string = '';
  categoriaSelecionada: any;
  atorSelecionado: any;
  titulos: Titulo[] = [];
  consultaRealizada: boolean = false;
  
  categorias: any[] = [];
  atores: any[] = [];
  
  carregando: boolean = false;
  carregandoCategorias: boolean = false;
  carregandoAtores: boolean = false;

  constructor(
    private router: Router,
    private tituloService: TituloService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarCategorias();
    this.carregarAtores();
  }

  selecionarTipoConsulta(tipo: string) {
    this.tipoConsulta = tipo;
    this.titulos = [];
    this.consultaRealizada = false;
  }

  consultarPorNome() {
    if (!this.filtroNome || this.filtroNome.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Digite um nome para buscar',
        life: 3000
      });
      return;
    }

    this.carregando = true;
    this.titulos = [];
    this.consultaRealizada = true;

    this.tituloService.buscarPorNome(this.filtroNome.trim()).subscribe({
      next: (titulos) => {
        this.titulos = titulos;
        this.carregando = false;
        
        if (titulos.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sem resultados',
            detail: `Nenhum título encontrado com o nome "${this.filtroNome}"`,
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar por nome:', error);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao buscar títulos',
          life: 5000
        });
      }
    });
  }

  consultarPorCategoria() {
    if (!this.categoriaSelecionada) {
      this.titulos = [];
      this.consultaRealizada = false;
      return;
    }

    this.carregando = true;
    this.titulos = [];
    this.consultaRealizada = true;

    this.tituloService.buscarPorCategoria(this.categoriaSelecionada.idClasse || this.categoriaSelecionada.id).subscribe({
      next: (titulos) => {
        this.titulos = titulos;
        this.carregando = false;
        
        if (titulos.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sem resultados',
            detail: `Nenhum título encontrado na categoria "${this.categoriaSelecionada.nome}"`,
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar por categoria:', error);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao buscar por categoria',
          life: 5000
        });
      }
    });
  }

  consultarPorAtor() {
    if (!this.atorSelecionado) {
      this.titulos = [];
      this.consultaRealizada = false;
      return;
    }

    this.carregando = true;
    this.titulos = [];
    this.consultaRealizada = true;

    this.tituloService.buscarPorAtor(this.atorSelecionado.idAtor || this.atorSelecionado.id).subscribe({
      next: (titulos) => {
        this.titulos = titulos;
        this.carregando = false;
        
        if (titulos.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sem resultados',
            detail: `Nenhum título encontrado com o ator "${this.atorSelecionado.nome}"`,
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar por ator:', error);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao buscar por ator',
          life: 5000
        });
      }
    });
  }

  verDetalhesTitulo(titulo: Titulo) {
    // Pode abrir um modal ou mostrar mais detalhes
    console.log('Detalhes do título:', titulo);
    
    // Exemplo de mensagem com detalhes
    this.messageService.add({
      severity: 'info',
      summary: `Detalhes: ${titulo.nome}`,
      detail: `
        Diretor: ${titulo.diretor?.nome || 'N/A'}
        Categoria: ${titulo.classe?.nome || 'N/A'}
        Valor: R$ ${titulo.classe?.valor || '0.00'}
        Atores: ${titulo.atores?.map(a => a.nome).join(', ') || 'N/A'}
      `,
      life: 10000
    });
  }

  voltarParaHome() {
    this.router.navigate(['/']);
  }

  private carregarCategorias() {
    this.carregandoCategorias = true;
    
    this.tituloService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregandoCategorias = false;
        console.log('Categorias carregadas:', categorias);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.carregandoCategorias = false;
        
        // Fallback: categorias mockadas
        this.categorias = [
          { idClasse: 1, nome: 'Ação', valor: 30 },
          { idClasse: 2, nome: 'Comédia', valor: 25 },
          { idClasse: 3, nome: 'Drama', valor: 28 }
        ];
      }
    });
  }

  private carregarAtores() {
    this.carregandoAtores = true;
    
    this.tituloService.getAtores().subscribe({
      next: (atores) => {
        this.atores = atores;
        this.carregandoAtores = false;
        console.log('Atores carregados:', atores);
      },
      error: (error) => {
        console.error('Erro ao carregar atores:', error);
        this.carregandoAtores = false;
        
        // Fallback: atores mockados
        this.atores = [
          { idAtor: 1, nome: 'Paulo' },
          { idAtor: 2, nome: 'Maria' },
          { idAtor: 3, nome: 'João' }
        ];
      }
    });
  }

  // Método para calcular quantidade disponível (se tiver essa informação)
  calcularDisponibilidade(titulo: Titulo): number {
    // Se seu backend não retornar quantidade, pode usar um valor padrão
    // Ou fazer uma chamada adicional para buscar itens disponíveis
    return titulo['quantidadeDisponivel'] || 1; // Valor padrão
  }
}