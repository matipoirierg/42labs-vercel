import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'https://4orbl9kif9.execute-api.sa-east-1.amazonaws.com';

  constructor(private http: HttpClient) { }

  uploadCV(file: File): Observable<any> {
    // Primero obtener la URL prefirmada
    return this.getPresignedUrl(file.name, file.type).pipe(
      switchMap(response => {
        // Luego subir el archivo directamente a S3
        return this.uploadToS3(response.uploadUrl, file);
      })
    );
  }

  private getPresignedUrl(fileName: string, contentType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-url`, {
      fileName,
      contentType
    });
  }

  private uploadToS3(presignedUrl: string, file: File): Observable<any> {
    return from(fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    }));
  }
}