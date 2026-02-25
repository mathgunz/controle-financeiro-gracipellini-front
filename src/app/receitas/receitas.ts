import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ModalOpcoes } from "../modal-opcoes/modal-opcoes";
import { ReceitaResponse, ReceitaService } from '../services/receita.service';
import { Mes, MesOption, criarMeses, obterMesAtualDisponivel, selecionarMesDisponivel } from '../utils/mes-selector.utils';

@Component({
  selector: 'app-receitas',
  templateUrl: './receitas.html',
  imports: [CommonModule, RouterModule, ModalOpcoes],
  styleUrls: ['./receitas.css']
})
export class Receitas implements OnInit {

  constructor(
    private router: Router,
    private receitaService: ReceitaService
  ) { }

  public showMesDrop = false;
  mostrarModal = false;
  itemSelecionado: any;

  public meses: MesOption[] = criarMeses();

  @Input() receitas = [
    { data: '1 dom', titulo: 'Casa - Banho Cachorras 1/6', descricao: 'Cartão de crédito | Outros', valor: 380 },
    { data: '1 dom', titulo: 'Casa - Berço Lara', descricao: 'Cartão de crédito | Outros', valor: 500 },
    { data: '10 ter', titulo: 'Casa - Financiamento Carro', descricao: 'Despesa fixa | Transporte', valor: 2300 },
    { data: '10 ter', titulo: 'Casa - Terapias - Itau', descricao: 'Cartão de crédito | Outros', valor: 5000 },
    { data: '12 qui', titulo: 'Pessoal - Vasectomia', descricao: 'Cartão de crédito | Outros', valor: 1200 }
  ];

  public mesSelecionado: Mes = obterMesAtualDisponivel(this.meses);

  ngOnInit(): void {
    this.carregarReceitas();
  }

  get total(): number {
    return this.receitas.reduce((acc, item) => acc + item.valor, 0);
  }

  abrirModal(item: any) {
    this.itemSelecionado = item;
    this.mostrarModal = true;
  }

    aoSelecionarOpcao(valor: string) {
    this.mostrarModal = false;

    // aqui você pode usar um mock ou ir buscar o real
    const mock = {
      ...this.itemSelecionado,
      tipo: 'despesa',
      tipoTransacao: 'Despesa fixa',
      categoria: 'Saúde',
      paga: true
    };

    const contaMock = {
      nome: this.itemSelecionado?.titulo || 'Conta Teste',
      valor: this.itemSelecionado?.valor || 292.88,
      data: new Date('2025-07-10'),
      tipo: 'despesa',
      tipoTransacao: 'Despesa fixa',
      categoria: 'Saúde',
      paga: true,
      parcelado: false,
      repetir: 'Mensalmente',
      qtd: 1,
      juros: 0,
      lembrete: false
    };
    
    this.router.navigate(['/nova-conta'], {
      state: { conta: contaMock, tipoEdicao: valor } // tipoEdicao: 'unica' | 'futuras' | 'todas'
    });
  }

  public toggleMesDrop() {
    this.showMesDrop = !this.showMesDrop;
  }

  public selecionarMes(mes: Mes) {
    this.mesSelecionado = selecionarMesDisponivel(mes, this.meses, this.mesSelecionado);
    this.showMesDrop = false;
    this.carregarReceitas();
  }

  private carregarReceitas(): void {
    const dataRecebimento = this.formatarDataFiltro(this.mesSelecionado);

    this.receitaService.listarReceitas(dataRecebimento).subscribe({
      next: (receitasApi) => {
        this.receitas = receitasApi.map((item: ReceitaResponse) => ({
          data: item.dataRecebimento,
          titulo: item.nome,
          descricao: item.repeticao,
          valor: Number(item.valor) || 0
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar receitas:', error);
        this.receitas = [];
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
