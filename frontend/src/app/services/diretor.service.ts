import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Diretor } from '../models/diretor.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiretorService {
  private apiUrl = 'http://localhost:8080/api/diretores';

  constructor(private http: HttpClient) {}

  // Listar todos os diretores
  getDiretores(): Observable<Diretor[]> {
    return this.http.get<Diretor[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erro ao carregar diretores:', err);
        return throwError(() => new Error('Falha ao carregar diretores.'));
      })
    );
  }

  // Adicionar novo diretor
  addDiretor(diretor: Diretor): Observable<Diretor> {
    return this.http.post<Diretor>(this.apiUrl, diretor).pipe(
      catchError(err => {
        console.error('Erro ao adicionar diretor:', err);
        return throwError(() => new Error('Falha ao adicionar diretor.'));
      })
    );
  }

  // Atualizar diretor existente
  updateDiretor(diretor: Diretor): Observable<Diretor> {
    return this.http.put<Diretor>(`${this.apiUrl}/${diretor.idDiretor}`, diretor).pipe(
      catchError(err => {
        console.error('Erro ao atualizar diretor:', err);
        return throwError(() => new Error('Falha ao atualizar diretor.'));
      })
    );
  }

  // Excluir diretor
  deleteDiretor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Erro ao excluir diretor:', err);
        return throwError(() => new Error('Falha ao excluir diretor.'));
      })
    );
  }
}
