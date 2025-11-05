import { Component, OnInit } from '@angular/core';
import { Ator } from './models/ator.model';
import { Classe } from './models/classe.model';
import { Diretor } from './models/diretor.model';
import { Titulo } from './models/titulo.model';
import { ItemDTO } from './models/itemDTO.model';
import { Cliente } from './models/cliente.model';
import { Socio } from './models/socio.model';
import { Dependente } from './models/dependente.model';
import { Locacao } from './models/locacao.model';

import { AtorService } from './services/ator.service';
import { ClasseService } from './services/classe.service';
import { DiretorService } from './services/diretor.service';
import { TituloService } from './services/titulo.service';
import { ItemService } from './services/item.service';
import { ClienteService } from './services/cliente.service';
import { SocioService } from './services/socio.service';
import { DependenteService } from './services/dependente.service';
import { LocacaoService } from './services/locacao.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  aba: string = 'atores';

  // Listas de entidades
  atores: Ator[] = [];
  classes: Classe[] = [];
  diretores: Diretor[] = [];
  titulos: Titulo[] = [];
  itens: (ItemDTO & { tituloNome?: string })[] = [];
  clientes: Cliente[] = [];
  socios: Socio[] = [];
  dependentes: Dependente[] = [];
  locacoes: Locacao[] = [];

  constructor(
    private atorService: AtorService,
    private classeService: ClasseService,
    private diretorService: DiretorService,
    private tituloService: TituloService,
    private itemService: ItemService,
    private clienteService: ClienteService,
    private socioService: SocioService,
    private dependenteService: DependenteService,
    private locacaoService: LocacaoService
  ) { }

  ngOnInit(): void {
    this.carregarTodos();
  }

  carregarTodos() {
    this.atorService.getAll().subscribe(a => this.atores = a);
    this.classeService.getAll().subscribe(c => this.classes = c);
    this.diretorService.getAll().subscribe(d => this.diretores = d);
    this.tituloService.getAll().subscribe(t => {
      this.titulos = t;
      this.itemService.getAll().subscribe(i => {
        this.itens = i.map(item => {
          const titulo = this.titulos.find(t => t.idTitulo === item.tituloId);
          return {
            ...item,
            tituloNome: titulo ? titulo.nome : 'Título não encontrado'
          };
        });
      });
    });
    this.clienteService.getAll().subscribe(c => this.clientes = c);
    this.socioService.getAll().subscribe(s => this.socios = s);
    this.dependenteService.getAll().subscribe(d => this.dependentes = d);
    this.locacaoService.getAll().subscribe(l => this.locacoes = l);
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
    const tipoItem = prompt("Tipo do item (FITA, DVD, BLURAY):");
    const dataAquisicao = prompt("Data de aquisição (YYYY-MM-DD):");
    const tituloId = parseInt(prompt("ID do título:") || '0', 10);

    if (!numeroSerie || !tipoItem || !dataAquisicao || tituloId <= 0) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAquisicao)) {
      alert("Formato de data inválido! Use YYYY-MM-DD.");
      return;




    }

    this.itemService.create({ numeroSerie, tipoItem, dataAquisicao, tituloId } as ItemDTO)
      .subscribe({
        next: () => this.carregarTodos(),
        error: (err) => alert('Erro ao criar item: ' + err.error)
      });
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
 
  // ================= CLIENTE =================
  novoCliente() {
    const numInscricao = parseInt(prompt("Número de inscrição:") || '0', 10);
    const nome = prompt("Nome do cliente:");
    const dtNascimento = prompt("Data de nascimento (YYYY-MM-DD):");
    const sexo = prompt("Sexo (M/F):");
    const estahAtivo = confirm("O cliente está ativo?");

    if (!numInscricao || !nome || !dtNascimento || !sexo) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    this.clienteService.create({ numInscricao, nome, dtNascimento, sexo, estahAtivo } as Cliente)
      .subscribe(() => this.carregarTodos());
  }

  alterarCliente(c: Cliente) {
    const numInscricao = parseInt(prompt("Número de inscrição:", c.numInscricao.toString()) || '0', 10);
    const nome = prompt("Nome do cliente:", c.nome);
    const dtNascimento = prompt("Data de nascimento (YYYY-MM-DD):", c.dtNascimento);
    const sexo = prompt("Sexo (M/F):", c.sexo);
    const estahAtivo = confirm("O cliente está ativo?");

    if (numInscricao && nome && dtNascimento && sexo) {
      this.clienteService.update({ ...c, numInscricao, nome, dtNascimento, sexo, estahAtivo })
        .subscribe(() => this.carregarTodos());
    }
  }

  excluirCliente(id: number) {
    if (confirm("Excluir cliente?")) {
      this.clienteService.delete(id).subscribe(() => this.carregarTodos());
    }
  }

  // ================= SÓCIO =================
  novoSocio() {
    const idCliente = parseInt(prompt("ID do cliente associado:") || '0', 10);
    const cpf = prompt("CPF do sócio:");
    const tel = prompt("Telefone do sócio:");
    const cliente = this.clientes.find(c => c.idCliente === idCliente);

    if (cliente && cpf && tel) {
      this.socioService.create({ ...cliente, cpf, tel } as Socio)
        .subscribe(() => this.carregarTodos());
    }
  }

  alterarSocio(s: Socio) {
    const cpf = prompt("CPF:", s.cpf || '');
    const tel = prompt("Telefone:", s.tel || '');
    if (cpf && tel) {
      this.socioService.update({ ...s, cpf, tel })
        .subscribe(() => this.carregarTodos());
    }
  }

  excluirSocio(id: number) {
    if (confirm("Excluir sócio?")) {
      this.socioService.delete(id).subscribe(() => this.carregarTodos());
    }
  }

  // ================= DEPENDENTE =================
  novoDependente() {
    const idCliente = parseInt(prompt("ID do cliente dependente:") || '0', 10);
    const idSocio = parseInt(prompt("ID do sócio responsável:") || '0', 10);
    const parentesco = prompt("Parentesco:");
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    const socio = this.socios.find(s => s.idSocio === idSocio);

    if (cliente && socio && parentesco) {
      this.dependenteService.create({ ...cliente, socioId: idSocio, parentesco } as Dependente)
        .subscribe(() => this.carregarTodos());
    }
  }

  alterarDependente(dep: Dependente) {
    const numInscricao = parseInt(prompt("Número de inscrição:", dep.numInscricao.toString()) || '0', 10);
    const nome = prompt("Nome do cliente:", dep.nome);
    const dtNascimento = prompt("Data de nascimento (YYYY-MM-DD):", dep.dtNascimento);
    const sexo = prompt("Sexo (M/F):", dep.sexo);
    const estahAtivo = confirm("O cliente está ativo?");
    const idSocio = parseInt(prompt("ID do sócio associado:", dep.socioId?.toString() || '0') || '0', 10);

    if (numInscricao && nome && dtNascimento && sexo && idSocio) {
      this.dependenteService.update({
        ...dep,
        numInscricao,
        nome,
        dtNascimento,
        sexo,
        estahAtivo,
        socioId: idSocio
      }).subscribe(() => this.carregarTodos());
    }
  }


  excluirDependente(id: number) {
    if (confirm("Excluir dependente?")) {
      this.dependenteService.delete(id).subscribe(() => this.carregarTodos());
    }
  }

  // ================= LOCAÇÃO =================
  novaLocacao() {
    const idCliente = parseInt(prompt("ID do cliente:") || '0', 10);
    const idItem = parseInt(prompt("ID do item:") || '0', 10);
    const dataLocacao = prompt("Data da locação (YYYY-MM-DD):");
    const dataDevolucao = prompt("Data de devolução (YYYY-MM-DD):");

    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    const item = this.itens.find(i => i.idItem === idItem);

    if (cliente && item && dataLocacao && dataDevolucao) {
      this.locacaoService.create({
        clienteId: idCliente,
        itemId: idItem,
        dataLocacao,
        dataDevolucao
      } as Locacao).subscribe(() => this.carregarTodos());
    }
  }

  alterarLocacao(l: Locacao) {
    const dataDevolucao = prompt("Nova data de devolução (YYYY-MM-DD):", l.dataDevolucao || '');
    if (dataDevolucao) {
      this.locacaoService.update({ ...l, dataDevolucao })
        .subscribe(() => this.carregarTodos());
    }
  }

  excluirLocacao(id: number) {
    if (confirm("Excluir locação?")) {
      this.locacaoService.delete(id).subscribe(() => this.carregarTodos());
    }
  }
}
