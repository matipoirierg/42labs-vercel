import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CV } from '../interfaces/cv.interface';
import { tap } from 'rxjs/operators';

interface SearchResponse {
  results: CV[];
  selectedRole: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://m9f18dlzpd.execute-api.sa-east-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  searchCVs(query: string): Observable<SearchResponse> {
    console.log('Enviando query:', query);
    return this.http.post<SearchResponse>(`${this.apiUrl}/prompt`, { query }).pipe(
      tap(response => console.log('Respuesta recibida:', response))
    );
  }
}