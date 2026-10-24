import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Session } from '../../core/session';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private router = inject(Router);
  private session = inject(Session);

  submit(e: Event) {
    e.preventDefault();
    this.enter('student');
  }

  enter(role: 'student' | 'host') {
    this.session.role.set(role);
    this.router.navigateByUrl(role === 'host' ? '/anfitrion' : '/estudiante');
  }
}
