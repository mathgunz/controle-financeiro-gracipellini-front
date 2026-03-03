import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ReceitaResponse, ReceitaService } from '../services/receita.service';
import { Mes, MesOption, criarMeses, obterMesAtualDisponivel, selecionarMesDisponivel } from '../utils/mes-selector.utils';

interface ReceitaListagemItem {
  id: number;
  data: string;
  titulo: string;
  descricao: string;
  valor: number;
}

@Component({
  selector: 'app-receitas',
  templateUrl: './receitas.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./receitas.css']
})
export class Receitas implements OnInit {

  constructor(
    private router: Router,
    private receitaService: ReceitaService
  ) { }

  public showMesDrop = false;

  public meses: MesOption[] = criarMeses();

  @Input() receitas: ReceitaListagemItem[] = [];

  public mesSelecionado: Mes = obterMesAtualDisponivel(this.meses);

  public removendoSelecionadas = false;

  private receitasSelecionadas = new Set<number>();

  ngOnInit(): void {
    this.carregarReceitas();
  }

  get total(): number {
    return this.receitas.reduce((acc, item) => acc + item.valor, 0);
  }

  get quantidadeSelecionada(): number {
    return this.receitasSelecionadas.size;
  }

  get todasSelecionadas(): boolean {
    return this.receitas.length > 0 && this.quantidadeSelecionada === this.receitas.length;
  }

  get selecaoParcial(): boolean {
    return this.quantidadeSelecionada > 0 && !this.todasSelecionadas;
  }

  abrirDetalhes(item: ReceitaListagemItem) {
    this.router.navigate(['/receitas', item.id]);
  }

  public toggleMesDrop() {
    this.showMesDrop = !this.showMesDrop;
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = selecionarMesDisponivel(mes, this.meses, this.mesSelecionado);
    this.showMesDrop = false;
    this.carregarReceitas();
  }

  public estaSelecionada(id: number): boolean {
    return this.receitasSelecionadas.has(id);
  }

  public alternarSelecionada(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.receitasSelecionadas.add(id);
      return;
    }

    this.receitasSelecionadas.delete(id);
  }

  public alternarSelecionarTodas(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.receitasSelecionadas = new Set(this.receitas.map((item) => item.id));
      return;
    }

    this.receitasSelecionadas.clear();
  }

  public removerSelecionadas(): void {
    if (this.quantidadeSelecionada === 0 || this.removendoSelecionadas) {
      return;
    }

    const quantidade = this.quantidadeSelecionada;
    const confirmar = window.confirm(`Deseja remover ${quantidade} receita(s) selecionada(s)?`);

    if (!confirmar) {
      return;
    }

    this.removendoSelecionadas = true;
    const ids = Array.from(this.receitasSelecionadas);

    forkJoin(ids.map((id) => this.receitaService.removerReceita(id)))
      .pipe(finalize(() => {
        this.removendoSelecionadas = false;
      }))
      .subscribe({
        next: () => {
          this.receitas = this.receitas.filter((item) => !this.receitasSelecionadas.has(item.id));
          this.receitasSelecionadas.clear();
        },
        error: (error) => {
          console.error('Erro ao remover receitas selecionadas:', error);
          window.alert('Não foi possível remover todas as receitas selecionadas.');
        }
      });
  }

  private carregarReceitas(): void {
    const dataRecebimento = this.formatarDataFiltro(this.mesSelecionado);

    this.receitaService.listarReceitas(dataRecebimento).subscribe({
      next: (receitasApi) => {
        this.receitas = receitasApi.map((item: ReceitaResponse) => ({
          id: item.id,
          data: item.dataRecebimento,
          titulo: item.nome,
          descricao: item.repeticao,
          valor: Number(item.valor) || 0
        }));
        this.receitasSelecionadas.clear();
      },
      error: (error) => {
        console.error('Erro ao carregar receitas:', error);
        this.receitas = [];
        this.receitasSelecionadas.clear();
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
