import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemDTO } from '../models/itemDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/api/itens';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<ItemDTO> {
    return this.http.get<ItemDTO>(`${this.apiUrl}/${id}`);
  }

  create(item: ItemDTO): Observable<ItemDTO> {
    return this.http.post<ItemDTO>(this.apiUrl, item);
  }

  update(id: number, item: ItemDTO): Observable<ItemDTO> {
    return this.http.put<ItemDTO>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
