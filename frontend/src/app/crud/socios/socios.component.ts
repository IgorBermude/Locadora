import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socio } from 'src/app/models/socio.model';
import { SocioService } from 'src/app/services/socio.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  providers: [MessageService, ConfirmationService]
})
export class SociosComponent implements OnInit {
  socios: Socio[] = [];
  socioForm!: FormGroup;
  displayDialog: boolean = false;
  editingSocio: boolean = false;
  socioSelecionado: Socio | null = null;
  carregando: boolean = false;

  opcoesSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
  ];

  constructor(
    private fb: FormBuilder,
    private socioService: SocioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.carregarSocios();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.socioForm = this.fb.group({
      idCliente: [null],
      numInscricao: [1, [Validators.required, Validators.min(1)]], // Valor padrão 1 com validação
      nome: ['', [Validators.required, Validators.minLength(3)]],
      dtNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      estahAtivo: [true],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      tel: ['', Validators.required]
    });
  }

  carregarSocios() {
    this.carregando = true;
    this.socioService.getAll().subscribe({
      next: (socios) => {
        this.socios = socios;
        this.carregando = false;
        console.log('Sócios carregados:', socios);
        
        // Encontrar o próximo número disponível baseado nos sócios existentes
        this.calcularProximoNumeroInscricao();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar sócios: ' + error.message
        });
        this.carregando = false;
      }
    });
  }

  calcularProximoNumeroInscricao() {
    if (this.socios.length > 0) {
      const maxNumInscricao = Math.max(...this.socios.map(s => s.numInscricao || 0));
      const proximoNumero = maxNumInscricao + 1;
      
      // Atualizar o formulário se estiver criando um novo sócio
      if (!this.editingSocio && this.socioForm) {
        this.socioForm.patchValue({
          numInscricao: proximoNumero
        });
      }
    }
  }

  abrirDialog(socio?: Socio) {
    if (socio) {
      this.editingSocio = true;
      this.socioSelecionado = socio;

      const dataNascimento = socio.dtNascimento ?
        new Date(socio.dtNascimento).toISOString().split('T')[0] : '';

      this.socioForm.patchValue({
        ...socio,
        dtNascimento: dataNascimento
      });
    } else {
      this.editingSocio = false;
      this.socioSelecionado = null;

      // Usar o próximo número calculado ou 1 como fallback
      const proximoNumero = this.socios.length > 0 
        ? Math.max(...this.socios.map(s => s.numInscricao || 0)) + 1
        : 1;

      this.socioForm.reset({
        estahAtivo: true,
        numInscricao: proximoNumero,
        dtNascimento: new Date().toISOString().split('T')[0]
      });
    }
    this.displayDialog = true;
  }

  salvar() {
    if (this.socioForm.invalid) {
      this.marcarCamposComoSujos();
      return;
    }

    const formValue = this.socioForm.getRawValue();
    console.log('Dados do formulário antes do envio:', formValue);

    // Garantir formato correto da data
    if (formValue.dtNascimento) {
      formValue.dtNascimento = new Date(formValue.dtNascimento).toISOString().split('T')[0];
    }

    console.log('Dados enviados para API:', formValue);

    const operacao = this.editingSocio
      ? this.socioService.update(formValue)
      : this.socioService.create(formValue);

    operacao.subscribe({
      next: (socioSalvo) => {
        console.log('Sócio salvo com sucesso:', socioSalvo);

        if (this.editingSocio) {
          const index = this.socios.findIndex(s => s.idCliente === socioSalvo.idCliente);
          this.socios[index] = socioSalvo;
        } else {
          this.socios.push(socioSalvo);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Sócio ${this.editingSocio ? 'atualizado' : 'criado'} com sucesso`
        });

        this.displayDialog = false;
        this.carregarSocios(); // Recarregar para ver o número final gerado pelo backend
      },
      error: (error) => {
        console.error('Erro detalhado ao salvar sócio:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || `Erro ao ${this.editingSocio ? 'atualizar' : 'criar'} sócio`
        });
      }
    });
  }

  excluir(socio: Socio) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o sócio <strong>${socio.nome}</strong>?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socioService.delete(socio.idCliente!).subscribe({
          next: () => {
            this.socios = this.socios.filter(s => s.idCliente !== socio.idCliente);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Sócio excluído com sucesso'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.message || 'Erro ao excluir sócio'
            });
          }
        });
      }
    });
  }

  private marcarCamposComoSujos() {
    Object.keys(this.socioForm.controls).forEach(key => {
      this.socioForm.get(key)?.markAsDirty();
    });
  }
}