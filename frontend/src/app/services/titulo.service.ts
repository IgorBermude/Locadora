import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Titulo } from '../models/titulo.model';

@Injectable({
  providedIn: 'root'
})
export class TituloService {
  private apiUrl = 'http://localhost:8080/api/titulos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Titulo> {
    return this.http.get<Titulo>(`${this.apiUrl}/${id}`);
  }

  create(titulo: Titulo): Observable<Titulo> {
    return this.http.post<Titulo>(this.apiUrl, titulo);
  }

  update(titulo: Titulo): Observable<Titulo> {
    return this.http.put<Titulo>(`${this.apiUrl}/${titulo.idTitulo}`, titulo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
