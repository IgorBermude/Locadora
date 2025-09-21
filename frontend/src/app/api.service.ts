import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface HelloResponse {
  message: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getHello(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>(`${this.baseUrl}/hello`);
  }
}

