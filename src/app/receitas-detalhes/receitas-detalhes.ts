import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceitaEdicaoRequest, ReceitaResponse, ReceitaService } from '../services/receita.service';

@Component({
  selector: 'app-receitas-detalhes',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './receitas-detalhes.html',
  styleUrls: ['./receitas-detalhes.css']
})
export class ReceitasDetalhes implements OnInit {
  public carregando = true;
  public salvando = false;
  public erro = '';
  public mensagem = '';
  public modoEdicao = false;
  public receita: ReceitaResponse | null = null;
  public receitaEdicao: ReceitaEdicaoRequest | null = null;

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
        this.receitaEdicao = this.criarModeloEdicao(receita);
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os detalhes da receita.';
        this.carregando = false;
      }
    });
  }

  public toggleEdicao(): void {
    if (!this.receita) {
      return;
    }

    this.modoEdicao = !this.modoEdicao;
    this.mensagem = '';

    if (this.modoEdicao) {
      this.receitaEdicao = this.criarModeloEdicao(this.receita);
    }
  }

  public salvarEdicao(): void {
    if (!this.receita || !this.receitaEdicao || this.salvando) {
      return;
    }

    const receitaAtual = this.receita;
    const dadosEdicao = this.receitaEdicao;

    this.salvando = true;
    this.mensagem = '';

    this.receitaService.salvarEdicaoMock(receitaAtual.id, dadosEdicao).subscribe({
      next: () => {
        this.receita = {
          ...receitaAtual,
          ...dadosEdicao,
          valor: String(dadosEdicao.valor)
        };
        this.modoEdicao = false;
        this.salvando = false;
        this.mensagem = 'Alteracao salva com sucesso.';
      },
      error: () => {
        this.salvando = false;
        this.mensagem = 'Nao foi possivel salvar a alteracao.';
      }
    });
  }

  private criarModeloEdicao(receita: ReceitaResponse): ReceitaEdicaoRequest {
    return {
      nome: receita.nome,
      valor: Number(receita.valor) || 0,
      dataRecebimento: receita.dataRecebimento,
      hasRecebida: receita.hasRecebida,
      quantidade: receita.quantidade,
      repeticao: receita.repeticao
    };
  }
}
