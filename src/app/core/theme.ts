import { Injectable, signal } from '@angular/core';

export type Mode = 'light' | 'dark';

/** Modo claro / oscuro. El tema se guarda en el navegador y se aplica con data-theme en <html>. */
@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly key = 'campusnest-theme';

  mode = signal<Mode>(this.read());

  constructor() {
    this.apply(this.mode());
  }

  toggle() {
    const next: Mode = this.mode() === 'dark' ? 'light' : 'dark';
    this.mode.set(next);
    this.apply(next);
    try {
      localStorage.setItem(this.key, next);
    } catch {
      // sin almacenamiento: el cambio solo dura esta visita
    }
  }

  /** Por defecto la aplicación abre en modo claro. */
  private read(): Mode {
    try {
      return localStorage.getItem(this.key) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  private apply(mode: Mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', mode === 'dark' ? '#121214' : '#F6F6F8');
  }
}
