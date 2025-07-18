import { Routes } from '@angular/router';
import { DespesasDetalhe } from './despesas-detalhe/despesas-detalhe';
import { Dashboard } from './dashboard/dashboard';
import { ReceitasDetalhe } from './receitas-detalhe/receitas-detalhe';
import { NovaConta } from './nova-conta/nova-conta';

export const routes: Routes = [
      { path: '', component: Dashboard },
  { path: 'despesas', component: DespesasDetalhe },
  { path: 'receitas', component: ReceitasDetalhe },
  { path: 'nova-conta', component: NovaConta },
  { path: '**', redirectTo: '' }
];