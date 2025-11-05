import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Locacao } from '../models/locacao.model';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private apiUrl = 'http://localhost:8080/api/locacoes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Locacao[]> {
    return this.http.get<Locacao[]>(this.apiUrl);
  }

  getById(id: number): Observable<Locacao> {
    return this.http.get<Locacao>(`${this.apiUrl}/${id}`);
  }

  create(loc: Locacao): Observable<Locacao> {
    return this.http.post<Locacao>(this.apiUrl, loc);
  }

  update(loc: Locacao): Observable<Locacao> {
    return this.http.put<Locacao>(`${this.apiUrl}/${loc.idLocacao}`, loc);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
