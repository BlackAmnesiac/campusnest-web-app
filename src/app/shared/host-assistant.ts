import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { Agent } from '../core/agent';
import { apiError } from '../core/api-error';

interface ChatMsg {
  from: 'me' | 'bot';
  text: string;
}

/** US 24: chat flotante con el asistente de IA del anfitrión. */
@Component({
  selector: 'app-host-assistant',
  template: `
    <button class="btn btn-primary ha-fab" type="button" (click)="open.set(!open())" [attr.aria-expanded]="open()">
      {{ open() ? 'Cerrar asistente' : 'Asistente IA' }}
    </button>
    @if (open()) {
      <section class="panel ha-panel" aria-label="Asistente de anfitrión">
        <div class="panel-h"><h2>Asistente de anfitrión</h2></div>
        <div class="ha-log" #log>
          @for (m of messages(); track $index) {
            <div class="ha-msg" [class.me]="m.from === 'me'">{{ m.text }}</div>
          }
          @if (busy()) {
            <div class="ha-msg muted">Escribiendo…</div>
          }
        </div>
        <div class="ha-form">
          <input
            class="inp"
            type="text"
            maxlength="500"
            placeholder="Ej.: Marca la Habitación 1 de Casa Surco como ocupada"
            aria-label="Mensaje para el asistente"
            [value]="text()"
            [disabled]="busy()"
            (input)="text.set($any($event.target).value)"
            (keydown.enter)="send()"
          />
          <button class="btn btn-primary" type="button" [disabled]="busy() || !text().trim()" (click)="send()">Enviar</button>
        </div>
      </section>
    }
  `,
  styles: `
    .ha-fab { position: fixed; right: 20px; bottom: 20px; z-index: 30; box-shadow: var(--sh2); }
    .ha-panel { position: fixed; right: 20px; bottom: 76px; z-index: 30; width: min(380px, calc(100vw - 40px)); display: flex; flex-direction: column; box-shadow: var(--sh2); }
    .ha-log { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; height: 300px; overflow-y: auto; }
    .ha-msg { background: var(--bg); border-radius: 12px; padding: 8px 12px; max-width: 85%; align-self: flex-start; white-space: pre-wrap; }
    .ha-msg.me { background: var(--primary-container); color: var(--secondary); align-self: flex-end; }
    .ha-form { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--border); }
    .ha-form .inp { flex: 1; min-width: 0; }
  `,
})
export class HostAssistant {
  private agent = inject(Agent);
  private log = viewChild<ElementRef<HTMLElement>>('log');

  /** Avisa al panel que algo cambió para que vuelva a cargar los datos. */
  changed = output<void>();

  open = signal(false);
  busy = signal(false);
  text = signal('');
  messages = signal<ChatMsg[]>([
    {
      from: 'bot',
      text: 'Hola, soy tu asistente. Por ahora puedo consultar tus habitaciones y marcar una como ocupada.',
    },
  ]);

  send() {
    const message = this.text().trim();
    if (!message || this.busy()) return;
    this.push({ from: 'me', text: message });
    this.text.set('');
    this.busy.set(true);
    this.agent.hostChat(message).subscribe({
      next: (reply) => {
        this.busy.set(false);
        this.push({ from: 'bot', text: reply.message });
        if (reply.roomsChanged) this.changed.emit();
      },
      error: (err) => {
        this.busy.set(false);
        this.push({ from: 'bot', text: apiError(err) });
      },
    });
  }

  private push(msg: ChatMsg) {
    this.messages.update((l) => [...l, msg]);
    setTimeout(() => {
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
