import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Titulo } from '../models/titulo.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  private apiUrl = 'http://localhost:8080/api/titulos';

  constructor(private http: HttpClient) { }

  getTitulos(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erro ao carregar títulos:', err);
        return throwError(() => new Error('Falha ao carregar títulos.'));
      })
    );
  }

  addTitulo(titulo: any): Observable<Titulo> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Titulo>(this.apiUrl, titulo, { headers });
  }

  updateTitulo(titulo: any): Observable<Titulo> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<Titulo>(`${this.apiUrl}/${titulo.idTitulo}`, titulo, { headers });
  }


  deleteTitulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erro ao excluir título:', err);
        return throwError(() => new Error('Falha ao excluir título.'));
      })
    );
  }
}
