import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ator } from '../models/ator.model';

@Injectable({
  providedIn: 'root'
})
export class AtorService {
  private apiUrl = 'http://localhost:8080/api/atores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ator[]> {
    return this.http.get<Ator[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ator> {
    return this.http.get<Ator>(`${this.apiUrl}/${id}`);
  }

  create(ator: Ator): Observable<Ator> {
    return this.http.post<Ator>(this.apiUrl, ator);
  }

  update(ator: Ator): Observable<Ator> {
    return this.http.put<Ator>(`${this.apiUrl}/${ator.id}`, ator);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
