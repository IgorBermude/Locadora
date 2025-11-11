import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemDTO } from '../models/itemDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/api/itens';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<ItemDTO> {
    return this.http.get<ItemDTO>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(item: ItemDTO): Observable<ItemDTO> {
    return this.http.post<ItemDTO>(this.apiUrl, item).pipe(catchError(this.handleError));
  }

  update(id: number, item: ItemDTO): Observable<ItemDTO> {
    return this.http.put<ItemDTO>(`${this.apiUrl}/${id}`, item).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro em ItemService:', error);
    let msg = 'Erro ao processar a solicitação de Item.';
    if (error.error instanceof ErrorEvent) msg = `Erro no cliente: ${error.error.message}`;
    else if (error.status === 0) msg = 'Falha de conexão com o servidor.';
    else msg = `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
