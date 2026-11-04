import { Component, DestroyRef, ElementRef, computed, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiError } from '../../core/api-error';
import { Chats } from '../../core/chats';
import { Session } from '../../core/session';
import { Toast } from '../../core/toast';

@Component({
  selector: 'app-mensajes',
  imports: [RouterLink],
  templateUrl: './mensajes.html',
})
export class Mensajes {
  chats = inject(Chats);
  session = inject(Session);
  private toast = inject(Toast);

  private box = viewChild<ElementRef<HTMLElement>>('chatBox');

  /** Cambia al abrir otra conversación o al llegar un mensaje nuevo (no en cada refresco). */
  private scrollKey = computed(() => `${this.chats.selected()?.id}:${this.chats.messages().length}`);

  constructor() {
    this.chats.reset();
    this.chats.load();
    // El backend no empuja mensajes: se consulta cada 5 s para ver lo que escribe la otra persona.
    const timer = setInterval(() => this.chats.load(), 5000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));

    effect(() => {
      this.scrollKey();
      setTimeout(() => {
        const el = this.box()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
  }

  initials(name: string) {
    return name
      .split(' ')
      .filter((x) => x)
      .slice(0, 2)
      .map((x) => x[0].toUpperCase())
      .join('');
  }

  send(e: Event, input: HTMLInputElement) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    this.chats.send(text).subscribe({
      next: () => (input.value = ''),
      error: (err) => this.toast.show(apiError(err)),
    });
  }
}
