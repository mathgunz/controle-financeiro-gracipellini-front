import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

type Mes = 'JAN/26' | 'FEV/26' | 'MAR/26' | 'ABR/26' | 'MAI/26' | 'JUN/26' | 'JUL/26' | 'AGO/26' | 'SET/26' | 'OUT/26' | 'NOV/26' | 'DEZ/26';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [CommonModule, CurrencyPipe, RouterModule]
})
export class Dashboard {

  public meses: Array<{ label: string; value: Mes; disabled: boolean }> = [
    { label: 'JAN/26', value: 'JAN/26', disabled: false },
    { label: 'FEV/26', value: 'FEV/26', disabled: false },
    { label: 'MAR/26', value: 'MAR/26', disabled: false },
    { label: 'ABR/26', value: 'ABR/26', disabled: false },
    { label: 'MAI/26', value: 'MAI/26', disabled: false },
    { label: 'JUN/26', value: 'JUN/26', disabled: false },
    { label: 'JUL/26', value: 'JUL/26', disabled: false },
    { label: 'AGO/26', value: 'AGO/26', disabled: false },
    { label: 'SET/26', value: 'SET/26', disabled: false },
    { label: 'OUT/26', value: 'OUT/26', disabled: true },
    { label: 'NOV/26', value: 'NOV/26', disabled: true },
    { label: 'DEZ/26', value: 'DEZ/26', disabled: true }
  ];

  public mesSelecionado: Mes = this.getMesAtual();
  public dados: DadosFinanceiros = this.getMock(this.mesSelecionado);

  public constructor(private router: Router) { }

  public navegarParaDetalheDespesas() {
    this.router.navigate(['/despesas']);
  }

  private getMesAtual(): Mes {
    const data = new Date();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);

    // Mapear número do mês para nome do mês
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const nomeMes = meses[data.getMonth()];
    const mesFormatado = `${nomeMes}/${ano}` as Mes;

    // Verificar se o mês atual existe na lista de meses disponíveis
    const mesExiste = this.meses.find(m => m.value === mesFormatado);
    if (mesExiste && !mesExiste.disabled) {
      return mesFormatado;
    }

    // Se não existir ou estiver desabilitado, retornar o último mês habilitado
    const mesHabilitado = [...this.meses].reverse().find(m => !m.disabled);
    return mesHabilitado?.value || 'FEV/26';
  }
  
  selecionarMes(mes: Mes) {
    this.mesSelecionado = mes;
    this.dados = this.getMock(mes);
    console.log(this.dados);
  }

  private getMock(mes: Mes): DadosFinanceiros {
    const mocks: Record<Mes, DadosFinanceiros> = {
      'JAN/26': {
        receitas: 1800, recebidas: 1600, aReceber: 200,
        despesas: 1200, pagas: 1000, aPagar: 200,
        despesasFixas: 450, despesasVariaveis: 350,
        cartaoCredito: 180, prestacoes: 220,
        aplicacoes: 550, investimentos: 320, poupancas: 150, previdencia: 80,
        saldo: 600, saldoAtual: 600, saldoAnterior: 500
      },
      'FEV/26': {
        receitas: 1900, recebidas: 1700, aReceber: 200,
        despesas: 1300, pagas: 1100, aPagar: 200,
        despesasFixas: 480, despesasVariaveis: 370,
        cartaoCredito: 200, prestacoes: 250,
        aplicacoes: 600, investimentos: 340, poupancas: 160, previdencia: 100,
        saldo: 600, saldoAtual: 600, saldoAnterior: 600
      },
      'MAR/26': {
        receitas: 2100, recebidas: 1900, aReceber: 200,
        despesas: 1400, pagas: 1200, aPagar: 200,
        despesasFixas: 500, despesasVariaveis: 400,
        cartaoCredito: 220, prestacoes: 280,
        aplicacoes: 650, investimentos: 370, poupancas: 180, previdencia: 100,
        saldo: 700, saldoAtual: 700, saldoAnterior: 600
      },
      'ABR/26': {
        receitas: 1700, recebidas: 1500, aReceber: 200,
        despesas: 1100, pagas: 900, aPagar: 200,
        despesasFixas: 420, despesasVariaveis: 330,
        cartaoCredito: 160, prestacoes: 190,
        aplicacoes: 500, investimentos: 290, poupancas: 140, previdencia: 70,
        saldo: 600, saldoAtual: 600, saldoAnterior: 700
      },
      'MAI/26': {
        receitas: 2200, recebidas: 2000, aReceber: 200,
        despesas: 1500, pagas: 1300, aPagar: 200,
        despesasFixas: 550, despesasVariaveis: 420,
        cartaoCredito: 250, prestacoes: 280,
        aplicacoes: 700, investimentos: 400, poupancas: 200, previdencia: 100,
        saldo: 700, saldoAtual: 700, saldoAnterior: 600
      },
      'JUN/26': {
        receitas: 2000, recebidas: 1800, aReceber: 200,
        despesas: 1500, pagas: 1200, aPagar: 300,
        despesasFixas: 500, despesasVariaveis: 400,
        cartaoCredito: 300, prestacoes: 300,
        aplicacoes: 800, investimentos: 500, poupancas: 200, previdencia: 100,
        saldo: 500, saldoAtual: 500, saldoAnterior: 300
      },
      'JUL/26': {
        receitas: 1500, recebidas: 1200, aReceber: 300,
        despesas: 1000, pagas: 700, aPagar: 300,
        despesasFixas: 400, despesasVariaveis: 300,
        cartaoCredito: 200, prestacoes: 100,
        aplicacoes: 500, investimentos: 300, poupancas: 100, previdencia: 100,
        saldo: 500, saldoAtual: 500, saldoAnterior: 400
      },
      'AGO/26': {
        receitas: 2500, recebidas: 2000, aReceber: 500,
        despesas: 1800, pagas: 1600, aPagar: 200,
        despesasFixas: 600, despesasVariaveis: 500,
        cartaoCredito: 400, prestacoes: 300,
        aplicacoes: 700, investimentos: 400, poupancas: 200, previdencia: 100,
        saldo: 700, saldoAtual: 700, saldoAnterior: 500
      },
      'SET/26': {
        receitas: 1800, recebidas: 1000, aReceber: 800,
        despesas: 1200, pagas: 1000, aPagar: 200,
        despesasFixas: 500, despesasVariaveis: 300,
        cartaoCredito: 250, prestacoes: 150,
        aplicacoes: 600, investimentos: 300, poupancas: 200, previdencia: 100,
        saldo: 600, saldoAtual: 600, saldoAnterior: 700
      },
      'OUT/26': {
        receitas: 1600, recebidas: 1400, aReceber: 200,
        despesas: 1100, pagas: 900, aPagar: 200,
        despesasFixas: 450, despesasVariaveis: 350,
        cartaoCredito: 180, prestacoes: 120,
        aplicacoes: 550, investimentos: 320, poupancas: 150, previdencia: 80,
        saldo: 500, saldoAtual: 500, saldoAnterior: 600
      },
      'NOV/26': {
        receitas: 2300, recebidas: 2000, aReceber: 300,
        despesas: 1600, pagas: 1400, aPagar: 200,
        despesasFixas: 520, despesasVariaveis: 430,
        cartaoCredito: 320, prestacoes: 330,
        aplicacoes: 750, investimentos: 420, poupancas: 220, previdencia: 110,
        saldo: 700, saldoAtual: 700, saldoAnterior: 500
      },
      'DEZ/26': {
        receitas: 2800, recebidas: 2500, aReceber: 300,
        despesas: 2000, pagas: 1800, aPagar: 200,
        despesasFixas: 600, despesasVariaveis: 500,
        cartaoCredito: 450, prestacoes: 450,
        aplicacoes: 900, investimentos: 550, poupancas: 250, previdencia: 100,
        saldo: 800, saldoAtual: 800, saldoAnterior: 700
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