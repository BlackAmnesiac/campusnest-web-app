import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HostAgentReply } from './models';

/** Conversación con los agentes de IA del backend (el token JWT lo agrega el interceptor). */
@Injectable({ providedIn: 'root' })
export class Agent {
  private http = inject(HttpClient);

  /** POST /api/agent/host/chat (solo anfitriones). */
  hostChat(message: string): Observable<HostAgentReply> {
    return this.http.post<HostAgentReply>(`${environment.apiUrl}/agent/host/chat`, { message });
  }
}
