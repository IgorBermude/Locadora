import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Classe } from '../models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8080/api/classes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe).pipe(
      catchError(this.handleError)
    );
  }

  update(classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${classe.idClasse}`, classe).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);
    let msg = 'Ocorreu um problema ao processar sua solicitação.';
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
