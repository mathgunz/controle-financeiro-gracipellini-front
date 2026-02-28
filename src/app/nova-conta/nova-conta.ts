import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DespesaService, DespesaRequest } from '../services/despesa.service';
import { ReceitaService, ReceitaRequest } from '../services/receita.service';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './nova-conta.html',
  styleUrl: './nova-conta.css'
})
export class NovaConta {

  constructor(private router: Router, private despesaService: DespesaService, private receitaService: ReceitaService) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state?.['conta']) {
      this.novaConta = state['conta'];
    }
  }

  @ViewChild('inputData') inputData!: ElementRef<HTMLInputElement>;

  irParaNovaConta() {
    this.router.navigate(['/nova-conta']);
  }

  fecharModal() {
    this.router.navigate(['']);
  }

  @Input() novaConta = {
    nome: '',
    valor: null,
    tipoConta: '',
    tipoPagamento: 'VARIAVEL',
    categoria: 'OUTROS',
    paga: false,
    repeticao: 'MENSALMENTE',
    quantidade: 1,
    dataTexto: ''
  };

  abrirCalendario() {
    if (this.inputData) {
      this.inputData.nativeElement.click();
      console.warn('inputData encontrado');
    } else {
      console.warn('inputData não encontrado');
    }
  }

  ngAfterViewInit() {
    // só para confirmar que a ref foi capturada
    console.log('inputData:', this.inputData);
  }

  get dataComoDate(): Date | null {
    const [dia, mes, ano] = this.novaConta.dataTexto?.split('/') || [];
    if (!dia || !mes || !ano) return null;
    return new Date(+ano, +mes - 1, +dia);
  }

  salvarNovaConta(): void {
    if (this.novaConta.tipoConta === 'despesa') {
      this.salvarDespesa();
    } else if (this.novaConta.tipoConta === 'receita') {
      this.salvarReceita();
    }
  }

  private salvarDespesa(): void {
    // Validar campos obrigatórios

    console.log('this.novaConta.dataTexto:', this.novaConta.categoria, this.novaConta.tipoPagamento, this.novaConta.repeticao);

    if (!this.novaConta.nome || !this.novaConta.valor || !this.novaConta.dataTexto) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Converter data de dd/MM/yyyy para yyyy-MM-dd
    console.log('this.novaConta.dataTexto:', this.novaConta.dataTexto);
    const dataPagamento = this.converterDataParaISO(this.novaConta.dataTexto);
    if (!dataPagamento) {
      alert('Data inválida');
      return;
    }

    // Construir objeto para enviar à API
    const despesaRequest: DespesaRequest = {
      nome: this.novaConta.nome,
      valor: Number(this.novaConta.valor),
      dataPagamento: dataPagamento,
      tipoPagamento: this.novaConta.tipoPagamento,
      categoria: this.novaConta.categoria,
      hasContaPaga: this.novaConta.paga,
      quantidade: this.novaConta.quantidade || 1,
      repeticao: this.novaConta.repeticao
    };

    // Fazer chamada POST
    this.despesaService.salvarDespesa(despesaRequest).subscribe({
      next: (response) => {
        console.log('Despesa salva com sucesso:', response);
        alert('Despesa salva com sucesso!');
        this.fecharModal();
      },
      error: (error) => {
        console.error('Erro ao salvar despesa:', error);
        alert('Erro ao salvar despesa. Tente novamente.');
      }
    });
  }

  private salvarReceita(): void {
    // Validar campos obrigatórios
    if (!this.novaConta.nome || !this.novaConta.valor || !this.novaConta.dataTexto) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Converter data de dd/MM/yyyy para yyyy-MM-dd
    const dataRecebimento = this.converterDataParaISO(this.novaConta.dataTexto);
    if (!dataRecebimento) {
      alert('Data inválida');
      return;
    }

    // Construir objeto para enviar à API
    const receitaRequest: ReceitaRequest = {
      nome: this.novaConta.nome,
      valor: Number(this.novaConta.valor),
      dataRecebimento: dataRecebimento,
      quantidade: this.novaConta.quantidade || 1,
      repeticao: this.novaConta.repeticao,
      hasRecebida: this.novaConta.paga
    };

    // Fazer chamada POST
    this.receitaService.salvarReceita(receitaRequest).subscribe({
      next: (response) => {
        console.log('Receita salva com sucesso:', response);
        alert('Receita salva com sucesso!');
        this.fecharModal();
      },
      error: (error) => {
        console.error('Erro ao salvar receita:', error);
        alert('Erro ao salvar receita. Tente novamente.');
      }
    });
  }

  private converterDataParaISO(dataTexto: string): string | null {
    let dia: string, mes: string, ano: string;

    if (dataTexto.includes('/')) {
      // Formato: dd/MM/yyyy
      const partes = dataTexto.split('/');
      dia = partes[0];
      mes = partes[1];
      ano = partes[2];
    } else {
      // Formato: ddMMyyyy (sem barras - ngxMask)
      if (dataTexto.length !== 8) return null;
      dia = dataTexto.substring(0, 2);
      mes = dataTexto.substring(2, 4);
      ano = dataTexto.substring(4, 8);
    }

    console.log('converterDataParaISO:', dataTexto, dia, mes, ano);
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
}
