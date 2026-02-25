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

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {

  private readonly API_URL = 'http://localhost:3000/receita';

  constructor(private http: HttpClient) { }

  salvarReceita(receita: ReceitaRequest): Observable<any> {
    return this.http.post<any>(this.API_URL, receita);
  }
}
