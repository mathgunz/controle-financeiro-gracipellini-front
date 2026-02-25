import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResumoService, Resumo } from '../services/resumo.service';
import { Mes, MesOption, criarMeses, obterMesAtualDisponivel, selecionarMesDisponivel, formatarMesParaDataAPI } from '../utils/mes-selector.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [CommonModule, CurrencyPipe, RouterModule]
})
export class Dashboard implements OnInit {

  @ViewChild('navContainer', { static: false }) navContainer!: ElementRef<HTMLElement>;

  public showMesDrop = false;

  public meses: MesOption[] = criarMeses();

  public mesSelecionado: Mes = obterMesAtualDisponivel(this.meses);
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
    const dataFormatada = formatarMesParaDataAPI(this.mesSelecionado);
    this.resumoService.obterResumo(dataFormatada).subscribe({
      next: (resumoData: Resumo[]) => {
        if (resumoData && resumoData.length > 0) {
          this.resumoAPI = resumoData[0];
          this.dados = this.mapearResumoParaDados(this.resumoAPI);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
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
      saldoMesAtual: resumo.saldo.saldoMesAtual,
      saldoAtual: resumo.saldo.saldoAtual,
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
      saldoMesAtual: 0,
      saldoAtual: 0,
      saldoAnterior: 0
    };
  }

  public navegarParaDetalheDespesas() {
    this.router.navigate(['/despesas']);
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = selecionarMesDisponivel(mes, this.meses, this.mesSelecionado);
    this.showMesDrop = false;
    this.carregarResumo();
  }

  public toggleMesDrop() {
    this.showMesDrop = !this.showMesDrop;
  }

  public scrollNav(direction: number) {
    if (!this.navContainer) return;
    const el = this.navContainer.nativeElement as HTMLElement;
    const amount = Math.round(el.clientWidth * 0.5) * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }
}

interface DadosFinanceiros {
  receitas: number;
  recebidas: number;
  aReceber: number;

  despesas: number;
  pagas: number;
  aPagar: number;

  saldoMesAtual: number;
  saldoAtual: number;
  saldoAnterior: number;
}
