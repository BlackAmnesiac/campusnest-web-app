import { Injectable, computed, signal } from '@angular/core';

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
  /** Servicios incluidos */
  s: string[];
}

// Datos de ejemplo. Luego se reemplazan por la API del backend (GET /api/rooms/search).
export const ROOMS: Room[] = [
  { id: 0, p: 650, t: 'Habitación individual frente al campus', d: 'San Miguel', m: 92, s: ['Agua', 'Luz', 'Internet'] },
  { id: 1, p: 480, t: 'Cuarto compartido con 1 estudiante, cerca a la PUCP', d: 'San Miguel', m: 85, s: ['Agua', 'Internet'] },
  { id: 2, p: 720, t: 'Habitación con baño propio y escritorio', d: 'Miraflores', m: 78, s: ['Agua', 'Luz', 'Internet', 'Lavandería'] },
  { id: 3, p: 390, t: 'Cuarto económico a 10 min de la UNMSM', d: 'Lima Cercado', m: 64, s: ['Agua'] },
  { id: 4, p: 550, t: 'Habitación amoblada en departamento de 3 estudiantes', d: 'Jesús María', m: 88, s: ['Agua', 'Luz', 'Cocina'] },
  { id: 5, p: 800, t: 'Suite individual con cocina y lavandería incluidas', d: 'San Borja', m: 71, s: ['Agua', 'Luz', 'Internet', 'Lavandería', 'Cocina'] },
  { id: 6, p: 430, t: 'Habitación pequeña, ambiente tranquilo para estudiar', d: 'Pueblo Libre', m: 95, s: ['Agua', 'Internet'] },
  { id: 7, p: 610, t: 'Cuarto luminoso con balcón cerca a la UPC', d: 'Surco', m: 57, s: ['Luz', 'Internet'] },
  { id: 8, p: 350, t: 'Cama en cuarto compartido, solo mujeres', d: 'Breña', m: 82, s: ['Agua', 'Luz'] },
  { id: 9, p: 690, t: 'Habitación individual, edificio con seguridad 24h', d: 'Magdalena', m: 74, s: ['Agua', 'Luz', 'Internet'] },
  { id: 10, p: 520, t: 'Cuarto con escritorio y wifi de fibra óptica', d: 'La Molina', m: 61, s: ['Internet', 'Lavandería'] },
  { id: 11, p: 940, t: 'Estudio privado amoblado, ideal para posgrado', d: 'Miraflores', m: 49, s: ['Agua', 'Luz', 'Internet', 'Lavandería'] },
];

@Injectable({ providedIn: 'root' })
export class Rooms {
  readonly all = ROOMS;
  private favs = signal<ReadonlySet<number>>(new Set([0, 4, 6]));

  favRooms = computed(() => this.all.filter((r) => this.favs().has(r.id)));

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
