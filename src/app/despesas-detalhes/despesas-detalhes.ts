import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DespesaEdicaoRequest, DespesaResponse, DespesaService } from '../services/despesa.service';

@Component({
  selector: 'app-despesas-detalhes',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './despesas-detalhes.html',
  styleUrls: ['./despesas-detalhes.css']
})
export class DespesasDetalhes implements OnInit {
  public carregando = true;
  public salvando = false;
  public erro = '';
  public mensagem = '';
  public modoEdicao = false;
  public despesa: DespesaResponse | null = null;
  public despesaEdicao: DespesaEdicaoRequest | null = null;

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
        this.despesaEdicao = this.criarModeloEdicao(despesa);
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os detalhes da despesa.';
        this.carregando = false;
      }
    });
  }

  public toggleEdicao(): void {
    if (!this.despesa) {
      return;
    }

    this.modoEdicao = !this.modoEdicao;
    this.mensagem = '';

    if (this.modoEdicao) {
      this.despesaEdicao = this.criarModeloEdicao(this.despesa);
    }
  }

  public salvarEdicao(): void {
    if (!this.despesa || !this.despesaEdicao || this.salvando) {
      return;
    }

    const despesaAtual = this.despesa;
    const dadosEdicao = this.despesaEdicao;

    this.salvando = true;
    this.mensagem = '';

    this.despesaService.salvarEdicaoMock(despesaAtual.id, dadosEdicao).subscribe({
      next: () => {
        this.despesa = {
          ...despesaAtual,
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

  private criarModeloEdicao(despesa: DespesaResponse): DespesaEdicaoRequest {
    return {
      nome: despesa.nome,
      valor: Number(despesa.valor) || 0,
      dataPagamento: despesa.dataPagamento,
      tipoPagamento: despesa.tipoPagamento,
      categoria: despesa.categoria,
      hasContaPaga: despesa.hasContaPaga,
      quantidade: despesa.quantidade,
      repeticao: despesa.repeticao,
      numeroParcela: despesa.numeroParcela
    };
  }
}
