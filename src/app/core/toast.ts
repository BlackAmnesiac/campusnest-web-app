import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

/** Mensajes breves ("Cambios guardados (demo)"). */
@Injectable({ providedIn: 'root' })
export class Toast {
  private router = inject(Router);
  private timer?: ReturnType<typeof setTimeout>;

  message = signal<string | null>(null);

  show(msg: string, go?: string) {
    this.message.set(msg);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(null), 2200);
    if (go) setTimeout(() => this.router.navigateByUrl(go), 700);
  }
}
