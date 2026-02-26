import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface DespesaRequest {
  nome: string;
  valor: number;
  dataPagamento: string;
  tipoPagamento: string;
  categoria: string;
  hasContaPaga: boolean;
  quantidade: number;
  repeticao: string;
}

export interface DespesaResponse {
  id: number;
  nome: string;
  valor: string;
  dataPagamento: string;
  tipoPagamento: string;
  categoria: string;
  hasContaPaga: boolean;
  quantidade: number;
  repeticao: string;
  dataCriacao: string;
  numeroParcela: number | null;
}

export interface DespesaEdicaoRequest {
  nome: string;
  valor: number;
  dataPagamento: string;
  tipoPagamento: string;
  categoria: string;
  hasContaPaga: boolean;
  quantidade: number;
  repeticao: string;
  numeroParcela: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private readonly API_URL = 'http://localhost:3000/despesa';

  constructor(private http: HttpClient) { }

  salvarDespesa(despesa: DespesaRequest): Observable<any> {
    return this.http.post<any>(this.API_URL, despesa);
  }

  listarDespesas(dataPagamento: string): Observable<DespesaResponse[]> {
    return this.http.get<DespesaResponse[]>(this.API_URL, {
      params: { dataPagamento }
    });
  }

  obterDespesaPorId(id: number): Observable<DespesaResponse> {
    return this.http.get<DespesaResponse>(`${this.API_URL}/${id}`);
  }

  salvarEdicaoMock(id: number, despesa: DespesaEdicaoRequest): Observable<{ sucesso: boolean }> {
    void id;
    void despesa;
    return of({ sucesso: true });
  }
}
