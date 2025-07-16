import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './nova-conta.html',
  styleUrl: './nova-conta.css'
})
export class NovaConta {

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state?.['conta']) {
      this.novaConta = state['conta'];
    }
  }

  @ViewChild('inputData') inputData!: ElementRef<HTMLInputElement>;

  irParaNovaConta() {
    this.router.navigate(['/nova-conta']);
  }

  @Input() novaConta = {
    nome: '',
    valor: null,
    data: new Date(),
    tipo: '',
    tipoTransacao: '',
    categoria: '',
    paga: false,
    parcelado: false,
    repetir: '',
    qtd: null,
    juros: null,
    lembrete: false,
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
}

export class NovaContaComponent {
  novaConta = {
    nome: '',
    valor: null,
    data: new Date(),
    tipo: '',
    tipoTransacao: '',
    categoria: '',
    paga: false,
    parcelado: false,
    repetir: '',
    qtd: null,
    juros: null,
    lembrete: false,
    dataTexto: ''
  };
}
