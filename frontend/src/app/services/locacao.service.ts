import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Locacao } from '../models/locacao.model';
import { Cliente } from '../models/cliente.model';
import { ItemDTO } from '../models/itemDTO.model';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private apiUrl = 'http://localhost:8080/api/locacoes';
  private clientesUrl = 'http://localhost:8080/api/clientes';
  private itensUrl = 'http://localhost:8080/api/itens';

  constructor(private http: HttpClient) {}

  // Locações
  getAll(): Observable<Locacao[]> {
    return this.http.get<Locacao[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Locacao> {
    return this.http.get<Locacao>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(locacao: Locacao): Observable<Locacao> {
    console.log('📍 Enviando locação com objetos completos:', locacao);
    return this.http.post<Locacao>(this.apiUrl, locacao).pipe(catchError(this.handleError));
  }

  update(locacao: Locacao): Observable<Locacao> {
    console.log('📍 Atualizando locação com objetos completos:', locacao);
    return this.http.put<Locacao>(`${this.apiUrl}/${locacao.idLocacao}`, locacao).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  registrarDevolucao(numeroSerie: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/devolucao`, { numeroSerie }).pipe(catchError(this.handleError));
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.clientesUrl).pipe(catchError(this.handleError));
  }

  // Itens
  getItens(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(this.itensUrl).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em LocacaoService:', error);
    let msg = 'Erro ao processar a solicitação.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    
    if (error.error && typeof error.error === 'string') {
      msg += ` - ${error.error}`;
    } else if (error.error && error.error.message) {
      msg += ` - ${error.error.message}`;
    }
    
    return throwError(() => new Error(msg));
  }
}