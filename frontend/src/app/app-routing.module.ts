import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  { path: '', redirectTo: '/atores', pathMatch: 'full' },
  { path: 'atores', component: AtoresComponent },
  { path: 'diretores', component: DiretoresComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'socios', component: SociosComponent },
  { path: 'dependentes', component: DependentesComponent },
  { path: 'locacoes', component: LocacoesComponent },
  { path: 'itens', component: ItensComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'titulos', component: TitulosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
