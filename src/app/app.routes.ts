import { Routes } from '@angular/router';
import { Despesas } from './despesas/despesas';
import { DespesasDetalhes } from './despesas-detalhes/despesas-detalhes';
import { Dashboard } from './dashboard/dashboard';
import { Receitas } from './receitas/receitas';
import { ReceitasDetalhes } from './receitas-detalhes/receitas-detalhes';
import { NovaConta } from './nova-conta/nova-conta';

export const routes: Routes = [
      { path: '', component: Dashboard },
  { path: 'despesas', component: Despesas },
  { path: 'despesas/:id', component: DespesasDetalhes },
  { path: 'receitas', component: Receitas },
  { path: 'receitas/:id', component: ReceitasDetalhes },
  { path: 'nova-conta', component: NovaConta },
  { path: '**', redirectTo: '' }
];
