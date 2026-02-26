import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DespesaResponse, DespesaService } from '../services/despesa.service';

@Component({
  selector: 'app-despesas-detalhes',
  imports: [CommonModule, RouterModule],
  templateUrl: './despesas-detalhes.html',
  styleUrls: ['./despesas-detalhes.css']
})
export class DespesasDetalhes implements OnInit {
  public carregando = true;
  public erro = '';
  public despesa: DespesaResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private despesaService: DespesaService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.carregando = false;
      this.erro = 'Id de despesa inválido.';
      return;
    }

    this.despesaService.obterDespesaPorId(id).subscribe({
      next: (despesa) => {
        this.despesa = despesa;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os detalhes da despesa.';
        this.carregando = false;
      }
    });
  }
}
