import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-opcoes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-box">
        <p class="modal-title">Opções de edição</p>
        <button (click)="selecionar('unica')">Esta repetição da conta</button>
        <button (click)="selecionar('futuras')">As próximas repetições da conta</button>
        <button (click)="selecionar('todas')">Todas as repetições da conta</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-box {
      background: #333;
      color: white;
      padding: 24px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 250px;
    }
    .modal-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    button {
      background: #444;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
    }
    button:hover {
      background: #555;
    }
  `]
})
export class ModalOpcoes {
  @Output() escolha = new EventEmitter<string>();

  selecionar(valor: string) {
    this.escolha.emit(valor);
  }
}