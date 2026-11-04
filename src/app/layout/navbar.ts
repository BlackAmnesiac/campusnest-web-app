import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { LANDING_URL } from '../config';
import { Auth } from '../core/auth';
import { Session } from '../core/session';
import { ThemeToggle } from '../shared/theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './navbar.html',
  host: { '(document:click)': 'menuOpen.set(false)' },
})
export class Navbar {
  session = inject(Session);
  private auth = inject(Auth);
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

  name = computed(() => this.auth.user()?.fullName ?? '');
  initials = computed(() =>
    this.name()
      .split(' ')
      .filter((x) => x)
      .slice(0, 2)
      .map((x) => x[0].toUpperCase())
      .join('') || '?',
  );

  toggle(e: Event) {
    e.stopPropagation();
    this.menuOpen.update((v) => !v);
  }
}
