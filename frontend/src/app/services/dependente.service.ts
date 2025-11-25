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

  constructor(private http: HttpClient) { }

  getAll(): Observable<Dependente[]> {
    return this.http.get<Dependente[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  create(dep: Dependente): Observable<Dependente> {
    // Converter para o formato que o backend espera
    const dependenteDTO = {
      nome: dep.nome?.trim() || '',
      dtNascimento: dep.dtNascimento || '',
      sexo: dep.sexo || 'M',
      estahAtivo: dep.estahAtivo !== undefined ? dep.estahAtivo : true,
      numInscricao: 1,
      clienteId: dep.socioId // ← Isso está correto!
    };

    console.log('Enviando DependenteDTO:', dependenteDTO);

    return this.http.post<Dependente>(this.apiUrl, dependenteDTO).pipe(
      catchError(this.handleError)
    );
  }

  update(dep: Dependente): Observable<Dependente> {
    const dependenteDTO = {
      idCliente: dep.idCliente,
      nome: dep.nome?.trim() || '',
      dtNascimento: dep.dtNascimento || '',
      sexo: dep.sexo || 'M',
      estahAtivo: dep.estahAtivo,
      numInscricao: dep.numInscricao || 1,
      clienteId: dep.socioId
    };

    return this.http.put<Dependente>(`${this.apiUrl}/${dep.idCliente}`, dependenteDTO).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em DependenteService:', error);

    let errorMessage = 'Erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += ` - ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}