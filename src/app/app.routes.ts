import { Routes } from '@angular/router';
import { authChildGuard } from './auth.guard';
import { Despesas } from './despesas/despesas';
import { DespesasDetalhes } from './despesas-detalhes/despesas-detalhes';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Receitas } from './receitas/receitas';
import { ReceitasDetalhes } from './receitas-detalhes/receitas-detalhes';
import { NovaConta } from './nova-conta/nova-conta';
import { loginGuard } from './login.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: '',
    canActivateChild: [authChildGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'despesas', component: Despesas },
      { path: 'despesas/:id', component: DespesasDetalhes },
      { path: 'receitas', component: Receitas },
      { path: 'receitas/:id', component: ReceitasDetalhes },
      { path: 'nova-conta', component: NovaConta }
    ]
  },
  { path: '**', redirectTo: '' }
];
