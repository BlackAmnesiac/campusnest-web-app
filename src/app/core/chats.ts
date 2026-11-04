import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth } from './auth';

export interface ChatMessage {
  me: boolean;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  /** Texto bajo el nombre (por ejemplo, la habitación de la solicitud). */
  subtitle: string;
  roomId: number | null;
  messages: ChatMessage[];
}

type Store = Record<string, Conversation[]>;

const KEY = 'campusnest-chats';

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(value: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // sin almacenamiento: las conversaciones duran solo esta visita
  }
}

/**
 * Conversaciones del usuario actual. Empiezan vacías y se guardan solo en este navegador
 * (el backend todavía no tiene módulo de mensajes).
 */
@Injectable({ providedIn: 'root' })
export class Chats {
  private auth = inject(Auth);
  private store = signal<Store>(read());

  private selectedId = signal<string | null>(null);

  conversations = computed(() => this.store()[String(this.auth.user()?.userId)] ?? []);
  selected = computed(() => {
    const list = this.conversations();
    return list.find((c) => c.id === this.selectedId()) ?? list[0];
  });

  /** Crea la conversación si no existe y la deja seleccionada. */
  open(id: string, name: string, subtitle: string, roomId: number | null) {
    this.update((list) => (list.some((c) => c.id === id) ? list : [...list, { id, name, subtitle, roomId, messages: [] }]));
    this.selectedId.set(id);
  }

  select(id: string) {
    this.selectedId.set(id);
  }

  send(text: string) {
    const id = this.selected()?.id;
    if (!id) return;
    const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    this.update((list) =>
      list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { me: true, text, time }] } : c)),
    );
  }

  private update(fn: (list: Conversation[]) => Conversation[]) {
    const uid = this.auth.user()?.userId;
    if (uid === undefined) return;
    this.store.update((s) => {
      const next = { ...s, [String(uid)]: fn(s[String(uid)] ?? []) };
      write(next);
      return next;
    });
  }
}
