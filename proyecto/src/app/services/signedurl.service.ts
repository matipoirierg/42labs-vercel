import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

interface SignedUrlResponse {
  signedUrl: string;
}

interface ErrorResponse {
  error: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignedurlService {
  private apiUrl = 'https://h0wekpfy7i.execute-api.sa-east-1.amazonaws.com';

  constructor(private http: HttpClient) { }

  getSignedUrl(s3Key: string): Observable<SignedUrlResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const s3key = encodeURIComponent(s3Key);

    return this.http.get<SignedUrlResponse>(`${this.apiUrl}/url/${s3key}`, { headers }).pipe(
      retry(2), // Retry the request up to 2 times in case of transient errors
      catchError(this.handleError) // Handle errors
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message; // Use the error message from the server
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}