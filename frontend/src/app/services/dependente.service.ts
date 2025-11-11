import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dependente } from '../models/dependente.model';

@Injectable({
  providedIn: 'root'
})
export class DependenteService {
  private apiUrl = 'http://localhost:8080/api/dependentes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Dependente[]> {
    return this.http.get<Dependente[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Dependente> {
    return this.http.get<Dependente>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(dep: Dependente): Observable<Dependente> {
    return this.http.post<Dependente>(this.apiUrl, dep).pipe(catchError(this.handleError));
  }

  update(dep: Dependente): Observable<Dependente> {
    return this.http.put<Dependente>(`${this.apiUrl}/${dep.idDependente}`, dep).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em DependenteService:', error);
    let msg = 'Erro ao processar a solicitação de Dependente.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
