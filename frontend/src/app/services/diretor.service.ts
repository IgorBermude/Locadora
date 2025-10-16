import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diretor } from '../models/diretor.model';

@Injectable({
  providedIn: 'root'
})
export class DiretorService {
  private apiUrl = 'http://localhost:8080/api/diretores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Diretor[]> {
    return this.http.get<Diretor[]>(this.apiUrl);
  }

  getById(id: number): Observable<Diretor> {
    return this.http.get<Diretor>(`${this.apiUrl}/${id}`);
  }

  create(diretor: Diretor): Observable<Diretor> {
    return this.http.post<Diretor>(this.apiUrl, diretor);
  }

  update(diretor: Diretor): Observable<Diretor> {
    return this.http.put<Diretor>(`${this.apiUrl}/${diretor.idDiretor}`, diretor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
