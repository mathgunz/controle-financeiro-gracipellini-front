import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    lembrete: false
  };
  
  abrirCalendario() {
    // lógica opcional para abrir datepicker se for implementado depois
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
    lembrete: false
  };
}
