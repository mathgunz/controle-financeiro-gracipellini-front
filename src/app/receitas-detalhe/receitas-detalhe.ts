import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ModalOpcoes } from "../modal-opcoes/modal-opcoes";

type Mes = 'JAN/26' | 'FEV/26' | 'MAR/26' | 'ABR/26' | 'MAI/26' | 'JUN/26' | 'JUL/26' | 'AGO/26' | 'SET/26' | 'OUT/26' | 'NOV/26' | 'DEZ/26';

@Component({
  selector: 'app-receitas-detalhe',
  templateUrl: './receitas-detalhe.html',
  imports: [CommonModule, RouterModule, ModalOpcoes],
  styleUrls: ['./receitas-detalhe.css']
})
export class ReceitasDetalhe {

  constructor(private router: Router) { }

  public showMesDrop = false;
  mostrarModal = false;
  itemSelecionado: any;

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

  @Input() despesas = [
    { data: '1 dom', titulo: 'Casa - Banho Cachorras 1/6', descricao: 'Cartão de crédito | Outros', valor: 380 },
    { data: '1 dom', titulo: 'Casa - Berço Lara', descricao: 'Cartão de crédito | Outros', valor: 500 },
    { data: '10 ter', titulo: 'Casa - Financiamento Carro', descricao: 'Despesa fixa | Transporte', valor: 2300 },
    { data: '10 ter', titulo: 'Casa - Terapias - Itau', descricao: 'Cartão de crédito | Outros', valor: 5000 },
    { data: '12 qui', titulo: 'Pessoal - Vasectomia', descricao: 'Cartão de crédito | Outros', valor: 1200 }
  ];

  public mesSelecionado: Mes = this.getMesAtual();

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
    this.mesSelecionado = mes;
    this.showMesDrop = false;
  }

  private getMesAtual(): Mes {
    const data = new Date();
    const ano = String(data.getFullYear()).slice(-2);
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const nomeMes = meses[data.getMonth()];
    const mesFormatado = `${nomeMes}/${ano}` as Mes;

    const mesExiste = this.meses.find(m => m.value === mesFormatado);
    if (mesExiste && !mesExiste.disabled) {
      return mesFormatado;
    }

    const mesHabilitado = [...this.meses].reverse().find(m => !m.disabled);
    return mesHabilitado?.value || 'FEV/26';
  }

}
