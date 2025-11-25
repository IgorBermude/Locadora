import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(catchError(this.handleError));
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.idCliente}`, cliente).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  desativar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/desativar`, {}).pipe(catchError(this.handleError));
  }

  reativar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reativar`, {}).pipe(catchError(this.handleError));
  }

  getTitulos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/titulos`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em ClienteService:', error);
    let msg = 'Erro ao processar a solicitação de Cliente.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
