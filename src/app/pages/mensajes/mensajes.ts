import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  imports: [RouterLink],
  templateUrl: './mensajes.html',
})
export class Mensajes {
  sel = signal(0);
  unread = signal([true, true, false, false]);
  private box = viewChild<ElementRef<HTMLElement>>('chatBox');
  messages = signal([
    { me: false, text: 'Hola Mateo, me interesa la habitación. ¿Sigue disponible?', time: '10:02' },
    { me: true, text: '¡Hola Andy! Sí, está disponible desde el 1 de noviembre.', time: '10:05' },
    { me: false, text: 'Perfecto. ¿Puedo visitarla el lunes al mediodía?', time: '10:07' },
    { me: true, text: 'Claro, el lunes a las 12 te espero.', time: '10:09' },
  ]);

  select(i: number) {
    this.sel.set(i);
    this.unread.update((u) => u.map((v, k) => (k === i ? false : v)));
  }

  send(e: Event, input: HTMLInputElement) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    this.messages.update((m) => [...m, { me: true, text, time: 'Ahora' }]);
    input.value = '';
    setTimeout(() => {
      const el = this.box()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
