import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socio } from '../models/socio.model';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = 'http://localhost:8080/api/socios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  create(socio: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.apiUrl, socio);
  }

  update(socio: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/${socio.idSocio}`, socio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
