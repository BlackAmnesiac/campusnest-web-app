import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chats } from '../../core/chats';
import { Session } from '../../core/session';

@Component({
  selector: 'app-mensajes',
  imports: [RouterLink],
  templateUrl: './mensajes.html',
})
export class Mensajes {
  chats = inject(Chats);
  session = inject(Session);

  private box = viewChild<ElementRef<HTMLElement>>('chatBox');

  constructor() {
    // Al cambiar de conversación o enviar un mensaje, baja hasta el último.
    effect(() => {
      this.chats.selected()?.messages.length;
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

  last(c: { messages: { text: string }[]; subtitle: string }) {
    return c.messages.length ? c.messages[c.messages.length - 1].text : c.subtitle;
  }

  send(e: Event, input: HTMLInputElement) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    this.chats.send(text);
    input.value = '';
  }
}
