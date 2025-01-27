import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CV } from '../interfaces/cv.interface';

interface VerificationResponse {
  message: string;
  verificado: boolean;
  item: CV;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl = 'https://tw7cnlk5s4.execute-api.sa-east-1.amazonaws.com'; // Ajusta según tu configuración

  constructor(private http: HttpClient) {}

  getCVs(): Observable<CV[]> {
    return this.http.get<CV[]>(`${this.apiUrl}/cvs`);
  }

  getCV(id: string): Observable<CV> {
    return this.http.get<CV>(`${this.apiUrl}/cvs/${id}`);
  }

  deleteCV(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cvs/${id}`);
  }

  toggleVerification(id: string): Observable<VerificationResponse> {
    return this.http.patch<VerificationResponse>(`${this.apiUrl}/cvs/${id}/verificar`, {});
  }

  updateCV(id: string, cv: Partial<CV>): Observable<CV> {
    return this.http.patch<CV>(`${this.apiUrl}/actualizar/${id}`, cv);
  }

  generatePDF(cv: CV): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generar-pdf`, cv, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}