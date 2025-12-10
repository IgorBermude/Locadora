import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Titulo } from '../models/titulo.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  private apiUrl = 'http://localhost:8080/api/titulos';

  constructor(private http: HttpClient) { }

  // Método existente - retorna todos os títulos
  getTitulos(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // 1. Consulta por Nome
  buscarPorNome(nome: string): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(`${this.apiUrl}/buscar/nome?nome=${encodeURIComponent(nome)}`).pipe(
      catchError(this.handleError)
    );
  }

  // 2. Consulta por Categoria (Classe)
  buscarPorCategoria(categoriaId: number): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(`${this.apiUrl}/buscar/categoria?categoriaId=${categoriaId}`).pipe(
      catchError(this.handleError)
    );
  }

  // 3. Consulta por Ator
  buscarPorAtor(atorId: number): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(`${this.apiUrl}/buscar/ator?atorId=${atorId}`).pipe(
      catchError(this.handleError)
    );
  }

  // 4. Buscar todas as categorias (classes)
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/classes').pipe(
      catchError(this.handleError)
    );
  }

  // 5. Buscar todos os atores
  getAtores(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/atores').pipe(
      catchError(this.handleError)
    );
  }

  // Métodos CRUD existentes
  addTitulo(titulo: any): Observable<Titulo> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Titulo>(this.apiUrl, titulo, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateTitulo(titulo: any): Observable<Titulo> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<Titulo>(`${this.apiUrl}/${titulo.idTitulo}`, titulo, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTitulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Tratamento de erro
  private handleError(error: HttpErrorResponse) {
    console.error('Erro no TituloService:', error);
    
    let errorMessage = 'Erro ao processar a solicitação.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
      
      if (error.error && error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}