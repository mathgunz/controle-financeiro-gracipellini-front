import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ModalOpcoes } from "../modal-opcoes/modal-opcoes";
import { Mes, MesOption, criarMeses, obterMesAtualDisponivel, selecionarMesDisponivel } from '../utils/mes-selector.utils';

@Component({
  selector: 'app-despesas-detalhe',
  templateUrl: './despesas-detalhe.html',
  imports: [CommonModule, RouterModule, ModalOpcoes],
  styleUrls: ['./despesas-detalhe.css']
})
export class DespesasDetalhe {

  constructor(private router: Router) { }

  public showMesDrop = false;
  mostrarModal = false;
  itemSelecionado: any;

  public meses: MesOption[] = criarMeses();

  @Input() despesas = [
    { data: '1 dom', titulo: 'Casa - Banho Cachorras 1/6', descricao: 'Cartão de crédito | Outros', valor: 380 },
    { data: '1 dom', titulo: 'Casa - Berço Lara', descricao: 'Cartão de crédito | Outros', valor: 500 },
    { data: '10 ter', titulo: 'Casa - Financiamento Carro', descricao: 'Despesa fixa | Transporte', valor: 2300 },
    { data: '10 ter', titulo: 'Casa - Terapias - Itau', descricao: 'Cartão de crédito | Outros', valor: 5000 },
    { data: '12 qui', titulo: 'Pessoal - Vasectomia', descricao: 'Cartão de crédito | Outros', valor: 1200 }
  ];

  public mesSelecionado: Mes = obterMesAtualDisponivel(this.meses);

  get total(): number {
    return this.despesas.reduce((acc, item) => acc + item.valor, 0);
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
  }
}
