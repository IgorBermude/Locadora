import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AtorComponent } from './components/ator.component';
import { ReactiveFormsModule } from '@angular/forms';
// importar outros componentes...

@NgModule({
  declarations: [
    AppComponent,
    AtorComponent,
    // outros componentes
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // importante para serviços que fazem HTTP
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
