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
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
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
        const token = this.extrairToken(response);

        if (token) {
          localStorage.setItem(AUTH_STORAGE_KEY, '1');
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_STORAGE_KEY) === '1' && !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private extrairToken(response: LoginResponse): string | null {
    const tokenBruto =
      response?.token ??
      response?.accessToken ??
      response?.data?.token ??
      response?.data?.accessToken;

    if (!tokenBruto || typeof tokenBruto !== 'string') {
      return null;
    }

    return tokenBruto.replace(/^Bearer\s+/i, '').trim() || null;
  }
}
