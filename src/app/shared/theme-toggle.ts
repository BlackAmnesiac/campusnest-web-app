import { Component, inject } from '@angular/core';
import { Theme } from '../core/theme';

/** Botón de la navbar para cambiar entre modo claro y oscuro. */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      class="theme-toggle"
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.mode() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      [title]="theme.mode() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    >
      {{ theme.mode() === 'dark' ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  theme = inject(Theme);
}
