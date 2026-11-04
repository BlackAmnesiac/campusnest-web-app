import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiError } from './api-error';
import { ApplicationDto, VisitDto } from './models';

const api = environment.apiUrl;

// feat(student): añadir panel del estudiante con visitas, solicitudes y favoritos

/** Postulaciones y visitas del estudiante buscador. */
@Injectable({ providedIn: 'root' })
export class Seeker {
  private http = inject(HttpClient);

  applications = signal<ApplicationDto[]>([]);
  visits = signal<VisitDto[]>([]);
  error = signal<string | null>(null);

  /** GET /api/applications/mine y GET /api/visits/mine */
  load() {
    this.error.set(null);
    forkJoin({
      apps: this.http.get<ApplicationDto[]>(`${api}/applications/mine`),
      vis: this.http.get<VisitDto[]>(`${api}/visits/mine`),
    }).subscribe({
      next: ({ apps, vis }) => {
        this.applications.set(apps);
        this.visits.set(vis);
      },
      error: (err) => this.error.set(apiError(err)),
    });
  }

  /** POST /api/rooms/{id}/applications */
  apply(roomId: number) {
    return this.http.post<ApplicationDto>(`${api}/rooms/${roomId}/applications`, {}).pipe(tap(() => this.load()));
  }

  /** POST /api/rooms/{id}/visits (fecha y hora futuras) */
  propose(roomId: number, dateTime: string) {
    return this.http
      .post<VisitDto>(`${api}/rooms/${roomId}/visits`, { visitDateTime: dateTime })
      .pipe(tap(() => this.load()));
  }
}
