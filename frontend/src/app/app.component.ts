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
