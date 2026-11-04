/**Se encarga de traer las habitaciones desde el backend y mantenerlas en memoria. */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { apiError } from './api-error';

/** Habitación tal como la usa la interfaz. */
export interface Room {
  id: number;
  /** Precio mensual en soles */
  p: number;
  /** Título */
  t: string;
  /** Distrito */
  d: string;
  /** Porcentaje de match de convivencia */
  m: number;
  /** Características (amoblado, baño privado) */
  s: string[];
  /** Descripción */
  desc: string;
  furnished: boolean;
  bath: boolean;
  propertyId: number;
}

/** Respuesta de GET /api/rooms/search */
interface RoomSearchResponse {
  id: number;
  propertyId: number;
  name: string;
  description: string;
  monthlyPrice: number;
  furnished: boolean;
  privateBathroom: boolean;
  status: string;
  district: string;
  compatibilityScore: number;
}

const toRoom = (r: RoomSearchResponse): Room => ({
  id: r.id,
  p: Number(r.monthlyPrice),
  t: r.name,
  d: r.district,
  m: r.compatibilityScore,
  desc: r.description,
  furnished: r.furnished,
  bath: r.privateBathroom,
  propertyId: r.propertyId,
  s: [r.furnished ? 'Amoblado' : '', r.privateBathroom ? 'Baño privado' : ''].filter((x) => x),
});

@Injectable({ providedIn: 'root' })
export class Rooms {
  private http = inject(HttpClient);

  all = signal<Room[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  private favs = signal<ReadonlySet<number>>(new Set());

  favRooms = computed(() => this.all().filter((r) => this.favs().has(r.id)));

  /** Trae las habitaciones disponibles desde el backend. */
  load(profile?: { cleanliness?: number; noise?: number }) {
    let params = new HttpParams();
    if (profile?.cleanliness) params = params.set('cleanlinessLevel', profile.cleanliness);
    if (profile?.noise) params = params.set('noiseLevel', profile.noise);
    this.loading.set(true);
    this.error.set(null);
    this.http.get<RoomSearchResponse[]>(`${environment.apiUrl}/rooms/search`, { params }).subscribe({
      next: (list) => {
        this.all.set(list.map(toRoom));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }
// Se actualiza la lista de favoritos agregando o eliminando el id de la habitación según corresponda.
  isFav(id: number) {
    return this.favs().has(id);
  }

  toggleFav(id: number) {
    this.favs.update((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
