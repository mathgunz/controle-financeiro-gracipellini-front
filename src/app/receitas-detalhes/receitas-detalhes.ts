import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReceitaEdicaoRequest, ReceitaResponse, ReceitaService, TipoEdicaoReceita } from '../services/receita.service';

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
  public mostrarModalTipoEdicao = false;
  public receita: ReceitaResponse | null = null;
  public receitaEdicao: ReceitaEdicaoRequest | null = null;
  public tiposEdicao: { valor: TipoEdicaoReceita; label: string }[] = [
    { valor: 'CONTA_SELECIONADA', label: 'Conta selecionada' },
    { valor: 'PROXIMAS_CONTAS', label: 'Proximas contas' },
    { valor: 'TODAS_CONTAS', label: 'Todas as contas' }
  ];

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
    if (!this.receita || !this.receitaEdicao || this.salvando || !this.modoEdicao) {
      return;
    }

    this.mostrarModalTipoEdicao = true;
    this.mensagem = '';
  }

  public fecharModalTipoEdicao(): void {
    if (this.salvando) {
      return;
    }

    this.mostrarModalTipoEdicao = false;
  }

  public confirmarTipoEdicao(tipoEdicao: TipoEdicaoReceita): void {
    if (!this.receita || !this.receitaEdicao || this.salvando) {
      return;
    }

    const receitaAtual = this.receita;
    const dadosEdicao = this.receitaEdicao;

    this.salvando = true;
    this.mostrarModalTipoEdicao = false;
    this.mensagem = '';

    this.receitaService.salvarEdicao(receitaAtual.id, dadosEdicao, tipoEdicao).subscribe({
      next: (resultado) => {
        const receitaAtualizada = resultado.find((item) => item.id === receitaAtual.id) ?? resultado[0];
        this.receita = receitaAtualizada ?? {
          ...receitaAtual,
          ...dadosEdicao,
          valor: String(dadosEdicao.valor),
          dataRecebimento: receitaAtual.dataRecebimento,
          quantidade: receitaAtual.quantidade,
          repeticao: receitaAtual.repeticao,
          dataCriacao: receitaAtual.dataCriacao
        };

        this.receitaEdicao = this.criarModeloEdicao(this.receita);
        this.modoEdicao = false;
        this.salvando = false;
        this.mensagem = 'Alteracao salva com sucesso.';
      },
      error: () => {
        this.salvando = false;
        this.mostrarModalTipoEdicao = false;
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
