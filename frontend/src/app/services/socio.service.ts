import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Socio } from '../models/socio.model';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = 'http://localhost:8080/api/socios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.apiUrl, socio).pipe(catchError(this.handleError));
  }

  update(socio: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/${socio.idSocio}`, socio).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em SocioService:', error);
    let msg = 'Erro ao processar a solicitação de Sócio.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
