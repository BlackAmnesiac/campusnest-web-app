import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seg, Chip } from '../../shared/directives';
import { Router } from '@angular/router';
import { Session } from '../../core/session';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, Seg, Chip],
  templateUrl: './registro.html',
})
export class Registro {
  private router = inject(Router);
  private session = inject(Session);

  role = this.session.regRole;
  pane = signal('rol');
  step = computed(() => ({ rol: 0, cuenta: 1, 'perfil-student': 2, 'perfil-host': 2, listo: 2 } as Record<string, number>)[this.pane()]);

  constructor() {
    // Viene de la Landing: ?role=host
    const r = new URLSearchParams(window.location.search).get('role');
    if (r === 'host' || r === 'student') this.role.set(r);
  }

  toProfile() {
    this.pane.set('perfil-' + this.role());
  }

  goDash() {
    this.session.role.set(this.role());
    this.router.navigateByUrl(this.role() === 'host' ? '/anfitrion' : '/buscar');
  }
}
