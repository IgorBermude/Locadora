import { Component, OnInit } from '@angular/core';
import { Ator } from './models/ator.model';
import { Classe } from './models/classe.model';
import { Diretor } from './models/diretor.model';
import { Titulo } from './models/titulo.model';
import { ItemDTO } from './models/itemDTO.model';

import { AtorService } from './services/ator.service';
import { ClasseService } from './services/classe.service';
import { DiretorService } from './services/diretor.service';
import { TituloService } from './services/titulo.service';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  aba: string = 'atores';

  atores: Ator[] = [];
  classes: Classe[] = [];
  diretores: Diretor[] = [];
  titulos: Titulo[] = [];
  itens: (ItemDTO & { tituloNome?: string })[] = [];

  constructor(
    private atorService: AtorService,
    private classeService: ClasseService,
    private diretorService: DiretorService,
    private tituloService: TituloService,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.carregarTodos();
  }

  carregarTodos() {
    // Carrega atores, classes e diretores normalmente
    this.atorService.getAll().subscribe(a => this.atores = a);
    this.classeService.getAll().subscribe(c => this.classes = c);
    this.diretorService.getAll().subscribe(d => this.diretores = d);

    // Carrega títulos primeiro
    this.tituloService.getAll().subscribe(t => {
      this.titulos = t;

      // Depois carrega itens
      this.itemService.getAll().subscribe(i => {
        this.itens = i.map(item => {
          // Encontra o título correspondente no array de títulos
          const titulo = this.titulos.find(t => t.idTitulo === item.tituloId);

          return {
            idItem: item.idItem,
            numeroSerie: item.numeroSerie,
            tipoItem: item.tipoItem,
            dataAquisicao: item.dataAquisicao,
            tituloId: item.tituloId,
            tituloNome: titulo ? titulo.nome : 'Título não encontrado'
          };
        });
      });
    });
  }


  // ================= CRUD Ator =================
  novoAtor() {
    const nome = prompt("Nome do ator:");
    if (nome) this.atorService.create({ nome } as Ator).subscribe(() => this.carregarTodos());
  }

  alterarAtor(ator: Ator) {
    const novoNome = prompt("Novo nome do ator:", ator.nome);
    if (novoNome) this.atorService.update({ ...ator, nome: novoNome }).subscribe(() => this.carregarTodos());
  }

  excluirAtor(id: number) {
    if (confirm("Excluir ator?")) this.atorService.delete(id).subscribe(() => this.carregarTodos());
  }

  // ================= CRUD Classe =================
  novaClasse() {
    const nome = prompt("Nome da classe:");
    const valor = parseFloat(prompt("Valor da classe:") || '0');
    const data = prompt("Data de devolução (YYYY-MM-DD):");
    if (nome && valor > 0 && data) {
      this.classeService.create({ nome, valor, dataDevolucao: data } as Classe)
        .subscribe(() => this.carregarTodos());
    }
  }

  alterarClasse(classe: Classe) {
    const novoNome = prompt("Novo nome da classe:", classe.nome);
    const novoValor = parseFloat(prompt("Novo valor da classe:", classe.valor.toString()) || '0');
    const novaData = prompt("Nova data de devolução (YYYY-MM-DD):", classe.dataDevolucao);
    if (novoNome && novoValor > 0 && novaData) {
      this.classeService.update({ ...classe, nome: novoNome, valor: novoValor, dataDevolucao: novaData })
        .subscribe(() => this.carregarTodos());
    }
  }

  excluirClasse(id: number) {
    if (confirm("Excluir classe?")) this.classeService.delete(id).subscribe(() => this.carregarTodos());
  }

  // ================= CRUD Diretor =================
  novoDiretor() {
    const nome = prompt("Nome do diretor:");
    if (nome) this.diretorService.create({ nome } as Diretor).subscribe(() => this.carregarTodos());
  }

  alterarDiretor(diretor: Diretor) {
    const novoNome = prompt("Novo nome do diretor:", diretor.nome);
    if (novoNome) this.diretorService.update({ ...diretor, nome: novoNome }).subscribe(() => this.carregarTodos());
  }

  excluirDiretor(id: number) {
    if (confirm("Excluir diretor?")) this.diretorService.delete(id).subscribe(() => this.carregarTodos());
  }

  // ================= CRUD Título =================
  novoTitulo() {
    const nome = prompt("Nome do título:");
    const classeId = parseInt(prompt("ID da classe:") || '0', 10);
    const diretorId = parseInt(prompt("ID do diretor:") || '0', 10);
    const classe = this.classes.find(c => c.idClasse === classeId);
    const diretor = this.diretores.find(d => d.idDiretor === diretorId);
    if (nome && classe && diretor) {
      const novo: Titulo = { nome, classe, diretor } as Titulo;
      this.tituloService.create(novo).subscribe(() => this.carregarTodos());
    }
  }

  alterarTitulo(titulo: Titulo) {
    const novoNome = prompt("Novo nome do título:", titulo.nome);
    const classeId = parseInt(prompt("ID da classe:", titulo.classe?.idClasse.toString()) || '0', 10);
    const diretorId = parseInt(prompt("ID do diretor:", titulo.diretor?.idDiretor.toString()) || '0', 10);
    const classe = this.classes.find(c => c.idClasse === classeId);
    const diretor = this.diretores.find(d => d.idDiretor === diretorId);
    if (novoNome && classe && diretor) {
      this.tituloService.update({ ...titulo, nome: novoNome, classe, diretor }).subscribe(() => this.carregarTodos());
    }
  }

  excluirTitulo(id: number) {
    if (confirm("Excluir título?")) this.tituloService.delete(id).subscribe(() => this.carregarTodos());
  }

  // ================= CRUD Item =================
  novoItem() {
    const numeroSerie = prompt("Número de série:");
    const tipoItem = prompt("Tipo do item:");
    const dataAquisicao = prompt("Data de aquisição (YYYY-MM-DD):");
    const tituloId = parseInt(prompt("ID do título:") || '0', 10);
    if (numeroSerie && tipoItem && dataAquisicao && tituloId > 0) {
      this.itemService.create({ numeroSerie, tipoItem, dataAquisicao, tituloId } as ItemDTO)
        .subscribe(() => this.carregarTodos());
    }
  }

  alterarItem(item: ItemDTO & { tituloNome?: string }) {
    const numeroSerie = prompt("Número de série:", item.numeroSerie);
    const tipoItem = prompt("Tipo do item:", item.tipoItem);
    const dataAquisicao = prompt("Data de aquisição (YYYY-MM-DD):", item.dataAquisicao);
    const tituloId = parseInt(prompt("ID do título:", item.tituloId.toString()) || '0', 10);

    if (numeroSerie && tipoItem && dataAquisicao && tituloId > 0) {
      this.itemService.update(item.idItem!, { numeroSerie, tipoItem, dataAquisicao, tituloId } as ItemDTO)
        .subscribe(() => this.carregarTodos());
    }
  }



  excluirItem(id: number) {
    if (confirm("Excluir item?")) this.itemService.delete(id).subscribe(() => this.carregarTodos());
  }
}
