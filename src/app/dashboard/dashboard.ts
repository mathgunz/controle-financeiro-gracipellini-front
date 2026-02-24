import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('navContainer', { static: false }) navContainer!: ElementRef<HTMLElement>;

  public showMesDrop = false;

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
    const dataFormatada = this.formatarDataParaAPI(this.mesSelecionado);
    this.resumoService.obterResumo(dataFormatada).subscribe({
      next: (resumoData: Resumo[]) => {
        if (resumoData && resumoData.length > 0) {
          this.resumoAPI = resumoData[0];
          this.dados = this.mapearResumoParaDados(this.resumoAPI);
        } else {
          //this.dados = this.getMock(this.mesSelecionado);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        //this.dados = this.getMock(this.mesSelecionado);
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

  private formatarDataParaAPI(mes: Mes): string {
    // Converte 'JAN/26' para '2026-01-01'
    const mesesMap: { [key: string]: string } = {
      'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
      'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
      'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
    };

    const [nomeMes, ano] = mes.split('/');
    const mesNumero = mesesMap[nomeMes];
    return `20${ano}-${mesNumero}-01`;
  }
  
  public navegarParaDetalheDespesas() {
    this.router.navigate(['/despesas']);
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = mes;
    this.showMesDrop = false;
    console.log(this.dados);
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