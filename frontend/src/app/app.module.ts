// app.module.ts ou outro módulo específico
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // para ngModel
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AppRoutingModule } from './app-routing.module'; 
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';


import { AppComponent } from './app.component';
import { DiretoresComponent } from './crud/diretores/diretores.component';
import { ItensComponent } from './crud/itens/itens.component';
import { LocacoesComponent } from './crud/locacoes/locacoes.component';
import { SociosComponent } from './crud/socios/socios.component';
import { ClientesComponent } from './crud/clientes/clientes.component';
import { DependentesComponent } from './crud/dependentes/dependentes.component';
import { AtoresComponent } from './crud/atores/atores.component';
import { ClassesComponent } from './crud/classes/classes.component';
import { TitulosComponent } from './crud/titulos/titulos.component';

import { HomeComponent } from './components/home/home.component';
import { ClienteConsultaComponent } from './components/cliente-consulta/cliente-consulta.component';
import { FuncionarioLayoutComponent } from './components/funcionario-layout/funcionario-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClienteConsultaComponent,
    FuncionarioLayoutComponent,
    AtoresComponent,
    DiretoresComponent,
    ClientesComponent,
    SociosComponent,
    DependentesComponent,
    LocacoesComponent,
    ItensComponent,
    ClassesComponent,
    TitulosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // obrigatório para PrimeNG
    FormsModule,             // obrigatório para ngModel

    // módulos do PrimeNG
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    SidebarModule,
    PanelMenuModule,
    InputTextModule,
    HttpClientModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    CalendarModule,
    ToastModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
