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
    return this.http.get<Socio[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  create(socio: Socio): Observable<Socio> {
    // Remover idSocio se existir, usar apenas idCliente
    const { idCliente, ...socioData } = socio;
    
    console.log('Enviando sócio para API:', socioData);
    return this.http.post<Socio>(this.apiUrl, socioData).pipe(
      catchError(this.handleError)
    );
  }

  update(socio: Socio): Observable<Socio> {
    // Usar idCliente para update
    const { idCliente, ...socioData } = socio;
    return this.http.put<Socio>(`${this.apiUrl}/${socio.idCliente}`, socioData).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro completo no SocioService:', error);
    console.error('Status:', error.status);
    console.error('Mensagem:', error.message);
    console.error('Erro detalhado:', error.error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: `;
      
      // Tentar extrair mensagem específica do backend
      if (error.error && typeof error.error === 'string') {
        errorMessage += error.error;
      } else if (error.error && error.error.message) {
        errorMessage += error.error.message;
      } else if (error.error && error.error.error) {
        errorMessage += error.error.error;
      } else {
        errorMessage += error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}