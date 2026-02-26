import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DespesaResponse, DespesaService } from '../services/despesa.service';
import { Mes, MesOption, criarMeses, obterMesAtualDisponivel, selecionarMesDisponivel } from '../utils/mes-selector.utils';

interface DespesaListagemItem {
  id: number;
  data: string;
  titulo: string;
  descricao: string;
  valor: number;
}

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./despesas.css']
})
export class Despesas implements OnInit {

  constructor(
    private router: Router,
    private despesaService: DespesaService
  ) { }

  public showMesDrop = false;

  public meses: MesOption[] = criarMeses();

  @Input() despesas: DespesaListagemItem[] = [];

  public mesSelecionado: Mes = obterMesAtualDisponivel(this.meses);

  ngOnInit(): void {
    this.carregarDespesas();
  }

  get total(): number {
    return this.despesas.reduce((acc, item) => acc + item.valor, 0);
  }

  abrirDetalhes(item: DespesaListagemItem) {
    this.router.navigate(['/despesas', item.id]);
  }

  public toggleMesDrop() {
    this.showMesDrop = !this.showMesDrop;
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = selecionarMesDisponivel(mes, this.meses, this.mesSelecionado);
    this.showMesDrop = false;
    this.carregarDespesas();
  }

  private carregarDespesas(): void {
    const dataPagamento = this.formatarDataFiltro(this.mesSelecionado);

    this.despesaService.listarDespesas(dataPagamento).subscribe({
      next: (despesasApi) => {
        this.despesas = despesasApi.map((item: DespesaResponse) => ({
          id: item.id,
          data: item.dataPagamento,
          titulo: item.nome,
          descricao: `${item.tipoPagamento} | ${item.categoria}`,
          valor: Number(item.valor) || 0
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar despesas:', error);
        this.despesas = [];
      }
    });
  }

  private formatarDataFiltro(mes: Mes): string {
    const [siglaMes, anoCurto] = mes.split('/');
    const mesesMap: Record<string, string> = {
      JAN: '01',
      FEV: '02',
      MAR: '03',
      ABR: '04',
      MAI: '05',
      JUN: '06',
      JUL: '07',
      AGO: '08',
      SET: '09',
      OUT: '10',
      NOV: '11',
      DEZ: '12'
    };

    const diaAtual = String(new Date().getDate()).padStart(2, '0');
    const mesNumero = mesesMap[siglaMes];
    return `20${anoCurto}-${mesNumero}-${diaAtual}`;
  }
}
