import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private readonly API_URL = 'http://localhost:3000/despesa';

  constructor(private http: HttpClient) { }

  salvarDespesa(despesa: DespesaRequest): Observable<any> {
    return this.http.post<any>(this.API_URL, despesa);
  }
}
