import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceitaResponse, ReceitaService } from '../services/receita.service';

@Component({
  selector: 'app-receitas-detalhes',
  imports: [CommonModule, RouterModule],
  templateUrl: './receitas-detalhes.html',
  styleUrls: ['./receitas-detalhes.css']
})
export class ReceitasDetalhes implements OnInit {
  public carregando = true;
  public erro = '';
  public receita: ReceitaResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private receitaService: ReceitaService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.carregando = false;
      this.erro = 'Id de receita invalido.';
      return;
    }

    this.receitaService.obterReceitaPorId(id).subscribe({
      next: (receita) => {
        this.receita = receita;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os detalhes da receita.';
        this.carregando = false;
      }
    });
  }
}
