import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import { APP_STATUS, VISIT_STATUS } from '../../core/labels';
import { Rooms } from '../../core/rooms';
import { Seeker } from '../../core/seeker';
import { RoomCard } from '../../shared/room-card';

// feat(student): añadir panel del estudiante con visitas, solicitudes y favoritos

@Component({
  selector: 'app-estudiante',
  imports: [RouterLink, DatePipe, RoomCard],
  templateUrl: './estudiante.html',
})
export class Estudiante {
  private auth = inject(Auth);
  rooms = inject(Rooms);
  seeker = inject(Seeker);

  tab = signal('visitas');
  appStatus = APP_STATUS;
  visitStatus = VISIT_STATUS;

  firstName = computed(() => (this.auth.user()?.fullName ?? '').split(' ')[0] || 'estudiante');
  activeVisits = computed(() => this.seeker.visits().filter((v) => v.status !== 'REJECTED').length);
  pendingApps = computed(() => this.seeker.applications().filter((a) => a.status === 'PENDING').length);

  constructor() {
    this.seeker.load();
    if (!this.rooms.all().length) this.rooms.load(this.auth.profile());
  }
}
