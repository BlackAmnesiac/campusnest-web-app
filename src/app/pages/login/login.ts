import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { apiError } from '../../core/api-error';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  constructor() {
    // Entrar al login equivale a cerrar la sesión anterior.
    this.auth.clear();
  }

  submit(e: Event, email: string, password: string) {
    e.preventDefault();
    this.error.set('');
    this.loading.set(true);
    this.auth.login(email.trim(), password).subscribe({
      next: (r) => this.router.navigateByUrl(r.role === 'HOST' ? '/anfitrion' : '/estudiante'),
      error: (err) => {
        this.loading.set(false);
        this.error.set(apiError(err));
      },
    });
  }
}
