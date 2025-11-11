import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Locacao } from '../models/locacao.model';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private apiUrl = 'http://localhost:8080/api/locacoes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Locacao[]> {
    return this.http.get<Locacao[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Locacao> {
    return this.http.get<Locacao>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(loc: Locacao): Observable<Locacao> {
    return this.http.post<Locacao>(this.apiUrl, loc).pipe(catchError(this.handleError));
  }

  update(loc: Locacao): Observable<Locacao> {
    return this.http.put<Locacao>(`${this.apiUrl}/${loc.idLocacao}`, loc).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em LocacaoService:', error);
    let msg = 'Erro ao processar a solicitação de Locação.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
