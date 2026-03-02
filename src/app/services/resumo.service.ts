import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url';

export interface Receita {
  totalRecebida: number;
  totalReceber: number;
}

export interface Despesa {
  totalPagar: number;
  totalPaga: number | string;
}

export interface Saldo {
  saldoMesAtual: number;
  saldoAtual: number;
}

export interface Resumo {
  receita: Receita;
  despesa: Despesa;
  saldo: Saldo;
}

@Injectable({
  providedIn: 'root'
})
export class ResumoService {

  private readonly API_URL = `${API_BASE_URL}/resumo`;

  constructor(private http: HttpClient) { }

  obterResumo(data?: string): Observable<Resumo[]> {
    const params = data ? { params: { data } } : {};
    return this.http.get<Resumo[]>(this.API_URL, params);
  }
}
