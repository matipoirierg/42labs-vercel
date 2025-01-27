import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'https://tw7cnlk5s4.execute-api.sa-east-1.amazonaws.com'; // Ajusta esto según tu configuración

  constructor(private http: HttpClient) { }

  uploadCV(payload: { fileContent: string; mimeType: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar-cv`, payload);
  }
}