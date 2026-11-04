import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Named } from './models';

/** Catálogos del backend: distritos (GET /api/districts) y servicios incluidos (GET /api/services). */
@Injectable({ providedIn: 'root' })
export class Catalog {
  private http = inject(HttpClient);

  // feat(anfitrion): agregar asistente para publicar habitacion

  districts = signal<Named[]>([]);
  services = signal<Named[]>([]);

  load() {
    this.http.get<Named[]>(`${environment.apiUrl}/districts`).subscribe({
      next: (d) => this.districts.set(d),
      error: () => this.districts.set([]),
    });
    this.http.get<Named[]>(`${environment.apiUrl}/services`).subscribe({
      next: (s) => this.services.set(s),
      error: () => this.services.set([]),
    });
  }
}
