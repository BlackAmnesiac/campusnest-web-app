import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Chats } from '../../core/chats';
import { Host } from '../../core/host';
import { ApplicationDto } from '../../core/models';
import { APP_STATUS, ROOM_STATUS, VISIT_STATUS } from '../../core/labels';

@Component({
  selector: 'app-anfitrion',
  imports: [RouterLink, DatePipe],
  templateUrl: './anfitrion.html',
})
export class Anfitrion {
  host = inject(Host);
  private chats = inject(Chats);
  private router = inject(Router);

  tab = signal('solic');
  appStatus = APP_STATUS;
  visitStatus = VISIT_STATUS;
  roomStatus = ROOM_STATUS;

  constructor() {
    this.host.load();
  }

  /** Acepta la solicitud, abre la conversación con el estudiante y lleva a Mensajes. */
  accept(a: ApplicationDto) {
    this.host.decideApplication(a.id, 'ACCEPTED', () => {
      this.chats.select(a.id);
      this.router.navigateByUrl('/mensajes');
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

  /** Solicitudes recibidas por una habitación. */
  requestsOf(roomId: number) {
    return this.host.applications().filter((a) => a.roomId === roomId).length;
  }
}
