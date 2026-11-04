import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiError } from './api-error';
import { Auth } from './auth';

/** US 02 Mensajes de chat */

const api = environment.apiUrl;

export interface ChatMessage {
  me: boolean;
  text: string;
  time: string;
}

/** Una conversación = una solicitud aceptada; el id es el de la solicitud. */
export interface Conversation {
  id: number;
  name: string;
  /** Habitación de la solicitud. */
  subtitle: string;
  roomId: number;
  lastMessage: string | null;
}

/** Respuesta de GET /api/conversations */
interface ConversationDto {
  applicationId: number;
  roomId: number;
  roomName: string;
  otherUserId: number;
  otherUserName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

/** Respuesta de GET/POST /api/conversations/{id}/messages */
interface MessageDto {
  id: number;
  applicationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
}

const hora = (iso: string) => new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

/** Mensajes entre anfitrión y estudiante (solo existen para solicitudes aceptadas). */
@Injectable({ providedIn: 'root' })
export class Chats {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  conversations = signal<Conversation[]>([]);
  messages = signal<ChatMessage[]>([]);
  /** false hasta que llega la primera respuesta del backend. */
  loaded = signal(false);
  error = signal<string | null>(null);

  private selectedId = signal<number | null>(null);
  selected = computed(() => {
    const list = this.conversations();
    return list.find((c) => c.id === this.selectedId()) ?? list[0];
  });

  /** Vacía lo cargado (otro usuario pudo usar el navegador antes). No cambia la conversación elegida. */
  reset() {
    this.conversations.set([]);
    this.messages.set([]);
    this.error.set(null);
    this.loaded.set(false);
  }

  /** GET /api/conversations y, de la conversación abierta, GET /api/conversations/{id}/messages */
  load() {
    this.http.get<ConversationDto[]>(`${api}/conversations`).subscribe({
      next: (list) => {
        this.conversations.set(
          list.map((c) => ({
            id: c.applicationId,
            name: c.otherUserName,
            subtitle: c.roomName,
            roomId: c.roomId,
            lastMessage: c.lastMessage,
          })),
        );
        this.error.set(null);
        this.loaded.set(true);
        this.loadMessages();
      },
      error: (err) => this.error.set(apiError(err)),
    });
  }

  /** Abre una conversación (por ejemplo, la que se acaba de crear al aceptar una solicitud). */
  select(id: number) {
    this.selectedId.set(id);
    if (this.conversations().some((c) => c.id === id)) this.loadMessages();
  }

  /** POST /api/conversations/{id}/messages */
  send(text: string) {
    const id = this.selected()?.id;
    return this.http.post<MessageDto>(`${api}/conversations/${id}/messages`, { content: text }).pipe(
      tap((m) => {
        if (this.selected()?.id === id) this.messages.update((l) => [...l, this.toMessage(m)]);
        this.conversations.update((l) => l.map((c) => (c.id === id ? { ...c, lastMessage: m.content } : c)));
      }),
    );
  }

  private loadMessages() {
    const id = this.selected()?.id;
    if (id === undefined) {
      this.messages.set([]);
      return;
    }
    this.http.get<MessageDto[]>(`${api}/conversations/${id}/messages`).subscribe({
      next: (list) => {
        // Si mientras tanto se abrió otra conversación, se descarta esta respuesta.
        if (this.selected()?.id === id) this.messages.set(list.map((m) => this.toMessage(m)));
      },
      error: (err) => this.error.set(apiError(err)),
    });
  }

  private toMessage(m: MessageDto): ChatMessage {
    return { me: m.senderId === this.auth.user()?.userId, text: m.content, time: hora(m.sentAt) };
  }
}
