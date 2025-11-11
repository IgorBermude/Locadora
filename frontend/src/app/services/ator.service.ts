import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ator } from '../models/ator.model';

@Injectable({
  providedIn: 'root'
})
export class AtorService {
  private apiUrl = 'http://localhost:8080/api/atores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ator[]> {
    return this.http.get<Ator[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Ator> {
    return this.http.get<Ator>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(ator: Ator): Observable<Ator> {
    return this.http.post<Ator>(this.apiUrl, ator).pipe(
      catchError(this.handleError)
    );
  }

  update(ator: Ator): Observable<Ator> {
    return this.http.put<Ator>(`${this.apiUrl}/${ator.idAtor}`, ator).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em AtorService:', error);
    let msg = 'Erro ao processar a solicitação de Ator.';
    if (error.error instanceof ErrorEvent) {
      msg = `Erro no cliente: ${error.error.message}`;
    } else if (error.status === 0) {
      msg = 'Falha de conexão com o servidor.';
    } else {
      msg = `Erro ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(msg));
  }
}
