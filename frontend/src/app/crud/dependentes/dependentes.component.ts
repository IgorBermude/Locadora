import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dependente } from 'src/app/models/dependente.model';
import { Socio } from 'src/app/models/socio.model';
import { DependenteService } from 'src/app/services/dependente.service';
import { SocioService } from 'src/app/services/socio.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dependentes',
  templateUrl: './dependentes.component.html',
  styleUrls: ['./dependentes.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class DependentesComponent implements OnInit {
  dependentes: Dependente[] = [];
  socios: Socio[] = [];
  dependenteForm!: FormGroup;
  displayDialog: boolean = false;
  editingDependente: boolean = false;
  dependenteSelecionado: Dependente | null = null;
  carregando: boolean = false;
  carregandoSocios: boolean = false;

  opcoesSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
  ];

  constructor(
    private fb: FormBuilder,
    private dependenteService: DependenteService,
    private socioService: SocioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.carregarSocios();
    this.carregarDependentes();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.dependenteForm = this.fb.group({
      idCliente: [null], // Use idCliente em vez de idDependente
      numInscricao: [0],
      nome: ['', Validators.required],
      dtNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      estahAtivo: [true],
      socioId: [null, Validators.required] // socioId em vez de idSocio
    });
  }

  carregarSocios() {
    this.carregandoSocios = true;
    this.socioService.getAll().subscribe({
      next: (socios) => {
        console.log('Sócios carregados para dependentes:', socios);
        this.socios = socios;
        this.carregandoSocios = false;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de sócios'
        });
        this.carregandoSocios = false;
      }
    });
  }

  carregarDependentes() {
    this.carregando = true;
    this.dependenteService.getAll().subscribe({
      next: (dependentes) => {
        console.log('Dependentes carregados:', dependentes);
        this.dependentes = dependentes;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dependentes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dependentes'
        });
        this.carregando = false;
      }
    });
  }

  abrirDialog(dependente?: Dependente) {
    if (this.socios.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Cadastre um sócio primeiro antes de adicionar dependentes'
      });
      return;
    }

    if (dependente) {
      this.editingDependente = true;
      this.dependenteSelecionado = dependente;
      this.dependenteForm.patchValue({
        ...dependente,
        dtNascimento: new Date(dependente.dtNascimento).toISOString().split('T')[0]
      });
    } else {
      this.editingDependente = false;
      this.dependenteSelecionado = null;
      this.dependenteForm.reset({
        estahAtivo: true,
        numInscricao: 0,
        dtNascimento: new Date().toISOString().split('T')[0]
      });
    }
    this.displayDialog = true;
  }

  salvar() {
    if (this.dependenteForm.invalid) {
      this.marcarCamposComoSujos();
      return;
    }

    const formValue = this.dependenteForm.getRawValue();

    // Garantir formato correto
    const dadosCorrigidos = {
      ...formValue,
      dtNascimento: new Date(formValue.dtNascimento).toISOString().split('T')[0],
      numInscricao: 1// Será gerado pelo backend
    };

    console.log('Enviando dependente:', dadosCorrigidos);

    const operacao = this.editingDependente
      ? this.dependenteService.update(dadosCorrigidos)
      : this.dependenteService.create(dadosCorrigidos);

    operacao.subscribe({
      next: (dependenteSalvo) => {
        console.log('Dependente salvo com sucesso:', dependenteSalvo);

        if (this.editingDependente) {
          const index = this.dependentes.findIndex(d => d.idCliente === dependenteSalvo.idCliente);
          this.dependentes[index] = dependenteSalvo;
        } else {
          this.dependentes.push(dependenteSalvo);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Dependente ${this.editingDependente ? 'atualizado' : 'criado'} com sucesso`
        });

        this.displayDialog = false;
        this.carregarDependentes(); // Recarregar lista
      },
      error: (error) => {
        console.error('Erro ao salvar dependente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || `Erro ao ${this.editingDependente ? 'atualizar' : 'criar'} dependente`
        });
      }
    });
  }

  excluir(dependente: Dependente) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o dependente <strong>${dependente.nome}</strong>?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dependenteService.delete(dependente.idCliente!).subscribe({
          next: () => {
            this.dependentes = this.dependentes.filter(d => d.idCliente !== dependente.idCliente);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Dependente excluído com sucesso'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.message || 'Erro ao excluir dependente'
            });
          }
        });
      }
    });
  }

  getNomeSocio(idSocio: number): string {
    const socio = this.socios.find(s => s.idCliente === idSocio);
    return socio ? socio.nome : '—';
  }

  private marcarCamposComoSujos() {
    Object.keys(this.dependenteForm.controls).forEach(key => {
      this.dependenteForm.get(key)?.markAsDirty();
    });
  }
}