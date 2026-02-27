import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public email = '';
  public senha = '';
  public erro = '';
  public enviando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public entrar(): void {
    this.erro = '';
    this.enviando = true;

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.enviando = false;
        this.authService.logout();
        this.erro = error.status === 401
          ? 'Email ou senha invalidos.'
          : 'Nao foi possivel autenticar. Tente novamente.';
      }
    });
  }
}
