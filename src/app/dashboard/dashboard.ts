import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResumoService, Resumo } from '../services/resumo.service';

type Mes = 'JAN/26' | 'FEV/26' | 'MAR/26' | 'ABR/26' | 'MAI/26' | 'JUN/26' | 'JUL/26' | 'AGO/26' | 'SET/26' | 'OUT/26' | 'NOV/26' | 'DEZ/26';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [CommonModule, CurrencyPipe, RouterModule]
})
export class Dashboard implements OnInit {

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
  public dados: DadosFinanceiros = this.getMockDefault();
  public resumoAPI: Resumo | null = null;

  public constructor(
    private router: Router,
    private resumoService: ResumoService
  ) { }

  ngOnInit(): void {
    this.carregarResumo();
  }

  private carregarResumo(): void {
    this.resumoService.obterResumo().subscribe({
      next: (resumoData: Resumo[]) => {
        if (resumoData && resumoData.length > 0) {
          this.resumoAPI = resumoData[0];
          this.dados = this.mapearResumoParaDados(this.resumoAPI);
        } else {
          this.dados = this.getMock(this.mesSelecionado);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.dados = this.getMock(this.mesSelecionado);
      }
    });
  }

  private mapearResumoParaDados(resumo: Resumo): DadosFinanceiros {
    const totalPaga = typeof resumo.despesa.totalPaga === 'string' 
      ? parseFloat(resumo.despesa.totalPaga) 
      : resumo.despesa.totalPaga;

    return {
      receitas: resumo.receita.totalRecebida + resumo.receita.totalReceber,
      recebidas: resumo.receita.totalRecebida,
      aReceber: resumo.receita.totalReceber,
      despesas: resumo.despesa.totalPagar + totalPaga,
      pagas: totalPaga,
      aPagar: resumo.despesa.totalPagar,
      saldo: resumo.saldo.total,
      saldoAtual: resumo.saldo.atual,
      saldoAnterior: 0
    };
  }

  public getMockDefault(): DadosFinanceiros {
    return {
      receitas: 0,
      recebidas: 0,
      aReceber: 0,
      despesas: 0,
      pagas: 0,
      aPagar: 0,
      saldo: 0,
      saldoAtual: 0,
      saldoAnterior: 0
    };
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
  
  public navegarParaDetalheDespesas() {
    this.router.navigate(['/despesas']);
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = mes;
    this.dados = this.getMock(mes);
    console.log(this.dados);
  }

  private getMock(mes: Mes): DadosFinanceiros {
    const mocks: Record<Mes, DadosFinanceiros> = {
      'JAN/26': {
        receitas: 1800, recebidas: 1600, aReceber: 200,
        despesas: 1200, pagas: 1000, aPagar: 200,
        saldo: 600, saldoAtual: 600, saldoAnterior: 500
      },
      'FEV/26': {
        receitas: 1900, recebidas: 1700, aReceber: 200,
        despesas: 1300, pagas: 1100, aPagar: 200,
        saldo: 600, saldoAtual: 600, saldoAnterior: 600
      },
      'MAR/26': {
        receitas: 2100, recebidas: 1900, aReceber: 200,
        despesas: 1400, pagas: 1200, aPagar: 200,
        saldo: 700, saldoAtual: 700, saldoAnterior: 600
      },
      'ABR/26': {
        receitas: 1700, recebidas: 1500, aReceber: 200,
        despesas: 1100, pagas: 900, aPagar: 200,
        saldo: 600, saldoAtual: 600, saldoAnterior: 700
      },
      'MAI/26': {
        receitas: 2200, recebidas: 2000, aReceber: 200,
        despesas: 1500, pagas: 1300, aPagar: 200,
        saldo: 700, saldoAtual: 700, saldoAnterior: 600
      },
      'JUN/26': {
        receitas: 2000, recebidas: 1800, aReceber: 200,
        despesas: 1500, pagas: 1200, aPagar: 300,
        saldo: 500, saldoAtual: 500, saldoAnterior: 300
      },
      'JUL/26': {
        receitas: 1500, recebidas: 1200, aReceber: 300,
        despesas: 1000, pagas: 700, aPagar: 300,
        saldo: 500, saldoAtual: 500, saldoAnterior: 400
      },
      'AGO/26': {
        receitas: 2500, recebidas: 2000, aReceber: 500,
        despesas: 1800, pagas: 1600, aPagar: 200,
        saldo: 700, saldoAtual: 700, saldoAnterior: 500
      },
      'SET/26': {
        receitas: 1800, recebidas: 1000, aReceber: 800,
        despesas: 1200, pagas: 1000, aPagar: 200,
        saldo: 600, saldoAtual: 600, saldoAnterior: 700
      },
      'OUT/26': {
        receitas: 1600, recebidas: 1400, aReceber: 200,
        despesas: 1100, pagas: 900, aPagar: 200,
        saldo: 500, saldoAtual: 500, saldoAnterior: 600
      },
      'NOV/26': {
        receitas: 2300, recebidas: 2000, aReceber: 300,
        despesas: 1600, pagas: 1400, aPagar: 200,
        saldo: 700, saldoAtual: 700, saldoAnterior: 500
      },
      'DEZ/26': {
        receitas: 2800, recebidas: 2500, aReceber: 300,
        despesas: 2000, pagas: 1800, aPagar: 200,
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

  saldo: number;
  saldoAtual: number;
  saldoAnterior: number;
}