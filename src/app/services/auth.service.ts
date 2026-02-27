import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const AUTH_STORAGE_KEY = 'fake_auth_logged';
export const AUTH_TOKEN_KEY = 'auth_token';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth/login';

  constructor(private http: HttpClient) { }

  public login(email: string, senha: string): Observable<LoginResponse> {
    const payload: LoginRequest = { email, senha };

    return this.http.post<LoginResponse>(this.API_URL, payload).pipe(
      tap((response) => {
        localStorage.setItem(AUTH_STORAGE_KEY, '1');
        if (response?.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_STORAGE_KEY) === '1';
  }

  public getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
