import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { LANDING_URL } from '../config';
import { Role, Session } from '../core/session';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  host: { '(document:click)': 'menuOpen.set(false)' },
})
export class Navbar {
  session = inject(Session);
  private router = inject(Router);

  landingUrl = LANDING_URL;
  menuOpen = signal(false);

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Login y registro usan la navbar pública. */
  isPublic = computed(() => {
    const u = this.url();
    return u === '/' || u.startsWith('/login') || u.startsWith('/registro');
  });

  toggle(e: Event) {
    e.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  switchRole(role: Role) {
    this.session.role.set(role);
    this.menuOpen.set(false);
    this.router.navigateByUrl(role === 'host' ? '/anfitrion' : '/estudiante');
  }
}
