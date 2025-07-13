import { Routes } from '@angular/router';
import { DespesasDetalhe } from './despesas-detalhe/despesas-detalhe';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
      { path: '', component: Dashboard },
  { path: 'despesas', component: DespesasDetalhe },
  { path: '**', redirectTo: '' }
];