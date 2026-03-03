import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
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

  public removendoSelecionadas = false;

  private despesasSelecionadas = new Set<number>();

  ngOnInit(): void {
    this.carregarDespesas();
  }

  get total(): number {
    return this.despesas.reduce((acc, item) => acc + item.valor, 0);
  }

  get quantidadeSelecionada(): number {
    return this.despesasSelecionadas.size;
  }

  get todasSelecionadas(): boolean {
    return this.despesas.length > 0 && this.quantidadeSelecionada === this.despesas.length;
  }

  get selecaoParcial(): boolean {
    return this.quantidadeSelecionada > 0 && !this.todasSelecionadas;
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

  public estaSelecionada(id: number): boolean {
    return this.despesasSelecionadas.has(id);
  }

  public alternarSelecionada(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.despesasSelecionadas.add(id);
      return;
    }

    this.despesasSelecionadas.delete(id);
  }

  public alternarSelecionarTodas(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.despesasSelecionadas = new Set(this.despesas.map((item) => item.id));
      return;
    }

    this.despesasSelecionadas.clear();
  }

  public removerSelecionadas(): void {
    if (this.quantidadeSelecionada === 0 || this.removendoSelecionadas) {
      return;
    }

    const quantidade = this.quantidadeSelecionada;
    const confirmar = window.confirm(`Deseja remover ${quantidade} despesa(s) selecionada(s)?`);

    if (!confirmar) {
      return;
    }

    this.removendoSelecionadas = true;
    const ids = Array.from(this.despesasSelecionadas);

    forkJoin(ids.map((id) => this.despesaService.removerDespesa(id)))
      .pipe(finalize(() => {
        this.removendoSelecionadas = false;
      }))
      .subscribe({
        next: () => {
          this.despesas = this.despesas.filter((item) => !this.despesasSelecionadas.has(item.id));
          this.despesasSelecionadas.clear();
        },
        error: (error) => {
          console.error('Erro ao remover despesas selecionadas:', error);
          window.alert('Não foi possível remover todas as despesas selecionadas.');
        }
      });
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
        this.despesasSelecionadas.clear();
      },
      error: (error) => {
        console.error('Erro ao carregar despesas:', error);
        this.despesas = [];
        this.despesasSelecionadas.clear();
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
