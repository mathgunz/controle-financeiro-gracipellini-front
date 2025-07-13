import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

type Mes = 'JUN/25' | 'JUL/25' | 'AGO/25';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [CurrencyPipe]
})
export class App {
  mesSelecionado: Mes = 'JUL/25';

  dados: DadosFinanceiros = this.getMock(this.mesSelecionado);

  selecionarMes(mes: Mes) {
    this.mesSelecionado = mes;
    this.dados = this.getMock(mes);
    console.log(this.dados);
  }

  private getMock(mes: Mes): DadosFinanceiros {
    const mocks: Record<Mes, DadosFinanceiros> = {
      'JUN/25': {
        receitas: 1500, recebidas: 1200, aReceber: 300,
        despesas: 1000, pagas: 700, aPagar: 300,
        despesasFixas: 400, despesasVariaveis: 300,
        cartaoCredito: 200, prestacoes: 100,
        aplicacoes: 500, investimentos: 300, poupancas: 100, previdencia: 100,
        saldo: 500, saldoAtual: 500, saldoAnterior: 400
      },
      'JUL/25': {
        receitas: 2500, recebidas: 2000, aReceber: 500,
        despesas: 1800, pagas: 1600, aPagar: 200,
        despesasFixas: 600, despesasVariaveis: 500,
        cartaoCredito: 400, prestacoes: 300,
        aplicacoes: 700, investimentos: 400, poupancas: 200, previdencia: 100,
        saldo: 700, saldoAtual: 700, saldoAnterior: 500
      },
      'AGO/25': {
        receitas: 1800, recebidas: 1000, aReceber: 800,
        despesas: 1200, pagas: 1000, aPagar: 200,
        despesasFixas: 500, despesasVariaveis: 300,
        cartaoCredito: 250, prestacoes: 150,
        aplicacoes: 600, investimentos: 300, poupancas: 200, previdencia: 100,
        saldo: 600, saldoAtual: 600, saldoAnterior: 700
      }
    };

    return mocks[mes];
  }
}

interface DadosFinanceiros {
  receitas: number;
  recebidas: number;
  aReceber: number;

  despesas: number;
  pagas: number;
  aPagar: number;
  despesasFixas: number;
  despesasVariaveis: number;
  cartaoCredito: number;
  prestacoes: number;

  aplicacoes: number;
  investimentos: number;
  poupancas: number;
  previdencia: number;

  saldo: number;
  saldoAtual: number;
  saldoAnterior: number;
}