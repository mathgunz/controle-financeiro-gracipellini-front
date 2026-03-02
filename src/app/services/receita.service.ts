import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url';

export interface ReceitaRequest {
  nome: string;
  valor: number;
  dataRecebimento: string;
  quantidade: number;
  repeticao: string;
  hasRecebida: boolean;
}

export interface ReceitaResponse {
  id: number;
  nome: string;
  valor: string;
  dataRecebimento: string;
  hasRecebida: boolean;
  quantidade: number;
  repeticao: string;
  dataCriacao: string;
}

export interface ReceitaEdicaoRequest {
  nome: string;
  valor: number;
  dataRecebimento: string;
  hasRecebida: boolean;
  quantidade: number;
  repeticao: string;
}

export type TipoEdicaoReceita = 'CONTA_SELECIONADA' | 'PROXIMAS_CONTAS' | 'TODAS_CONTAS';

export interface ReceitaEdicaoApiRequest {
  nome: string;
  valor: string;
  hasRecebida: boolean;
  tipoEdicao: TipoEdicaoReceita;
  dataRecebimento: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  private readonly API_URL = `${API_BASE_URL}/receita`;

  constructor(private http: HttpClient) { }

  salvarReceita(receita: ReceitaRequest): Observable<any> {
    return this.http.post<any>(this.API_URL, receita);
  }

  listarReceitas(dataRecebimento: string): Observable<ReceitaResponse[]> {
    return this.http.get<ReceitaResponse[]>(this.API_URL, {
      params: { dataRecebimento }
    });
  }

  obterReceitaPorId(id: number): Observable<ReceitaResponse> {
    return this.http.get<ReceitaResponse>(`${this.API_URL}/${id}`);
  }

  salvarEdicao(id: number, receita: ReceitaEdicaoRequest, tipoEdicao: TipoEdicaoReceita): Observable<ReceitaResponse[]> {
    const payload: ReceitaEdicaoApiRequest = {
      nome: receita.nome,
      valor: String(receita.valor),
      hasRecebida: receita.hasRecebida,
      tipoEdicao,
      dataRecebimento: receita.dataRecebimento,
    };

    return this.http.put<ReceitaResponse[]>(`${this.API_URL}/${id}`, payload);
  }
}
