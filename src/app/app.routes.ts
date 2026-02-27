import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { Despesas } from './despesas/despesas';
import { DespesasDetalhes } from './despesas-detalhes/despesas-detalhes';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Receitas } from './receitas/receitas';
import { ReceitasDetalhes } from './receitas-detalhes/receitas-detalhes';
import { NovaConta } from './nova-conta/nova-conta';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'despesas', component: Despesas, canActivate: [authGuard] },
  { path: 'despesas/:id', component: DespesasDetalhes, canActivate: [authGuard] },
  { path: 'receitas', component: Receitas, canActivate: [authGuard] },
  { path: 'receitas/:id', component: ReceitasDetalhes, canActivate: [authGuard] },
  { path: 'nova-conta', component: NovaConta, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
