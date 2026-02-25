import { Routes } from '@angular/router';
import { Despesas } from './despesas/despesas';
import { Dashboard } from './dashboard/dashboard';
import { Receitas } from './receitas/receitas';
import { NovaConta } from './nova-conta/nova-conta';

export const routes: Routes = [
      { path: '', component: Dashboard },
  { path: 'despesas', component: Despesas },
  { path: 'receitas', component: Receitas },
  { path: 'nova-conta', component: NovaConta },
  { path: '**', redirectTo: '' }
];
