import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Titulo } from 'src/app/models/titulo.model';
import { TituloService } from 'src/app/services/titulo.service';
import { DiretorService } from 'src/app/services/diretor.service';
import { ClasseService } from 'src/app/services/classe.service';
import { AtorService } from 'src/app/services/ator.service';
import { MessageService } from 'primeng/api';
import { Diretor } from 'src/app/models/diretor.model';
import { Classe } from 'src/app/models/classe.model';
import { Ator } from 'src/app/models/ator.model';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css'],
  providers: [MessageService]
})
export class TitulosComponent implements OnInit {
  titulos: Titulo[] = [];
  tituloForm!: FormGroup;
  displayDialog = false;
  diretores: Diretor[] = [];
  classes: Classe[] = [];
  atores: Ator[] = [];
  updateTitulo: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private diretorService: DiretorService,
    private classeService: ClasseService,
    private atorService: AtorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // apenas os campos que realmente existem no back-end
    this.tituloForm = this.fb.group({
      idTitulo: [null],
      nome: ['', Validators.required],
      classe: [null, Validators.required],
      diretor: [null, Validators.required],
      atores: [[]]
    });

    this.carregarDados();
  }

  carregarDados() {
    this.tituloService.getTitulos().subscribe({
      next: (dados) => {
        console.log('📦 Dados recebidos do backend:', dados);
        this.titulos = dados;
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar títulos:', erro);
        this.showError('Erro ao carregar títulos');
      }
    });

    this.diretorService.getDiretores().subscribe({
      next: (d) => (this.diretores = d)
    });

    this.classeService.getAll().subscribe({
      next: (d) => (this.classes = d)
    });

    this.atorService.getAll().subscribe({
      next: (d) => (this.atores = d)
    });
  }


  abrirDialog(titulo?: Titulo) {
    this.displayDialog = true;
    this.updateTitulo = !!titulo;

    if (titulo) {
      this.tituloForm.patchValue(titulo);
    } else {
      this.tituloForm.reset();
    }
  }

  salvar() {
    let titulo: Titulo = this.tituloForm.value;

    // Monta o payload incluindo o idTitulo se for update
    const payload = {
      idTitulo: titulo.idTitulo, // importante para o PUT
      nome: titulo.nome,
      classe: { idClasse: titulo.classe?.idClasse },
      diretor: { idDiretor: titulo.diretor?.idDiretor },
      atores: titulo.atores?.map((a: any) => ({ idAtor: a.idAtor ?? a.id })) || []
    };

    console.log('🟢 Enviando título:', JSON.stringify(payload, null, 2));

    // Decide qual operação chamar: POST ou PUT
    const operacao = this.updateTitulo
      ? this.tituloService.updateTitulo(payload) // PUT com id
      : this.tituloService.addTitulo(payload);   // POST sem id

    operacao.subscribe({
      next: () => {
        this.showSuccess('Título salvo com sucesso!');
        this.displayDialog = false;
        this.carregarDados(); // atualiza lista
      },
      error: (erro) => {
        console.error('Erro ao salvar:', erro);
        this.showError('Erro ao salvar título');
      }
    });
  }


  excluir(titulo: Titulo) {
    this.tituloService.deleteTitulo(titulo.idTitulo!).subscribe({
      next: () => {
        this.showSuccess('Título excluído com sucesso!');
        this.carregarDados();
      },
      error: () => this.showError('Erro ao excluir título')
    });
  }

  getNomesAtores(titulo: Titulo): string {
    return titulo.atores?.map(ator => ator.nome).join(', ') ?? '-';
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }
}
