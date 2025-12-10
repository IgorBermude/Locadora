import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importe os NOVOS componentes da pasta components/
import { HomeComponent } from './components/home/home.component';
import { ClienteConsultaComponent } from './components/cliente-consulta/cliente-consulta.component';
import { FuncionarioLayoutComponent } from './components/funcionario-layout/funcionario-layout.component';

// Importe os componentes CRUD existentes
import { AtoresComponent } from './crud/atores/atores.component';
import { DiretoresComponent } from './crud/diretores/diretores.component';
import { ClientesComponent } from './crud/clientes/clientes.component';
import { SociosComponent } from './crud/socios/socios.component';
import { DependentesComponent } from './crud/dependentes/dependentes.component';
import { LocacoesComponent } from './crud/locacoes/locacoes.component';
import { ItensComponent } from './crud/itens/itens.component';
import { ClassesComponent } from './crud/classes/classes.component';
import { TitulosComponent } from './crud/titulos/titulos.component';

const routes: Routes = [
  // Rota principal: Home (tela inicial com botões) - SEM MENU
  { path: '', component: HomeComponent },

  // Área do Cliente - SEM MENU
  { path: 'cliente', component: ClienteConsultaComponent },

  // Área do Funcionário - VAI DIRETO PARA ATORES COM MENU
  {
    path: 'funcionario',
    redirectTo: 'funcionario/atores',
    pathMatch: 'full'
  },

  // Rotas específicas dos CRUDs - TODAS COM MENU
  { path: 'funcionario/atores', component: AtoresComponent },
  { path: 'funcionario/diretores', component: DiretoresComponent },
  { path: 'funcionario/clientes', component: ClientesComponent },
  { path: 'funcionario/socios', component: SociosComponent },
  { path: 'funcionario/dependentes', component: DependentesComponent },
  { path: 'funcionario/locacoes', component: LocacoesComponent },
  { path: 'funcionario/itens', component: ItensComponent },
  { path: 'funcionario/classes', component: ClassesComponent },
  { path: 'funcionario/titulos', component: TitulosComponent },

  // Rotas antigas (redireciona para as novas)
  { path: 'atores', redirectTo: 'funcionario/atores' },
  { path: 'diretores', redirectTo: 'funcionario/diretores' },
  { path: 'clientes', redirectTo: 'funcionario/clientes' },
  { path: 'socios', redirectTo: 'funcionario/socios' },
  { path: 'dependentes', redirectTo: 'funcionario/dependentes' },
  { path: 'locacoes', redirectTo: 'funcionario/locacoes' },
  { path: 'itens', redirectTo: 'funcionario/itens' },
  { path: 'classes', redirectTo: 'funcionario/classes' },
  { path: 'titulos', redirectTo: 'funcionario/titulos' },

  // Redireciona qualquer rota não encontrada para a Home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }