import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  private readonly API_URL = 'http://localhost:3000/receita';

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
}
