import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependente } from '../models/dependente.model';

@Injectable({
  providedIn: 'root'
})
export class DependenteService {
  private apiUrl = 'http://localhost:8080/api/dependentes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Dependente[]> {
    return this.http.get<Dependente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Dependente> {
    return this.http.get<Dependente>(`${this.apiUrl}/${id}`);
  }

  create(dep: Dependente): Observable<Dependente> {
    return this.http.post<Dependente>(this.apiUrl, dep);
  }

  update(dep: Dependente): Observable<Dependente> {
    return this.http.put<Dependente>(`${this.apiUrl}/${dep.idDependente}`, dep);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
