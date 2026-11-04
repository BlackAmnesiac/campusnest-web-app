import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { apiError } from '../../core/api-error';
import { Auth } from '../../core/auth';
import { Rooms } from '../../core/rooms';
import { Seeker } from '../../core/seeker';
import { Session } from '../../core/session';
import { Toast } from '../../core/toast';

/** Devuelve la fecha mínima para agendar (dentro de 1 hora) en formato de <input type="datetime-local">. */
function minVisit(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

@Component({
  selector: 'app-habitacion',
  imports: [RouterLink],
  templateUrl: './habitacion.html',
})
export class Habitacion {
  private route = inject(ActivatedRoute);
  private seeker = inject(Seeker);
  private toast = inject(Toast);
  private auth = inject(Auth);
  rooms = inject(Rooms);
  session = inject(Session);

  private id = Number(this.route.snapshot.paramMap.get('id'));
  room = computed(() => this.rooms.all().find((r) => r.id === this.id));

  minVisit = minVisit();
  visitAt = signal('');
  busy = signal(false);

  constructor() {
    if (!this.rooms.all().length) this.rooms.load(this.auth.profile());
  }

  /** Se encarga de enviar una solicitud para unirse a una habitación */
  apply() {
    this.busy.set(true);
    this.seeker.apply(this.id).subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.show('Solicitud enviada');
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.show(apiError(err));
      },
    });
  }

  /** POST /api/rooms/{id}/visits */
  reserveVisit() {
    if (!this.visitAt()) {
      this.toast.show('Elige la fecha y la hora de la visita');
      return;
    }
    this.busy.set(true);
    this.seeker.propose(this.id, this.visitAt()).subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.show('Visita propuesta. El anfitrión debe aprobarla.');
      },
      error: (err) => {
        this.busy.set(false);
        this.toast.show(apiError(err));
      },
    });
  }
}
