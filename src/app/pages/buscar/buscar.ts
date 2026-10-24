import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rooms } from '../../core/rooms';
import { RoomCard } from '../../shared/room-card';

type Sort = 'm' | 'pa' | 'pd';

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nivel = (m: number) => (m >= 80 ? 'alto' : m >= 60 ? 'medio' : 'bajo');

@Component({
  selector: 'app-buscar',
  imports: [RouterLink, RoomCard],
  templateUrl: './buscar.html',
})
export class Buscar {
  private rooms = inject(Rooms);

  services = [
    { value: 'Agua', label: 'Agua' },
    { value: 'Luz', label: 'Luz' },
    { value: 'Internet', label: 'Internet' },
    { value: 'Lavandería', label: 'Lavandería' },
    { value: 'Cocina', label: 'Cocina compartida' },
  ];

  q = signal('');
  min = signal(100);
  max = signal(1500);
  svc = signal<string[]>([]);
  compat = signal('');
  sort = signal<Sort>('m');
  filtersOpen = signal(false);

  list = computed(() => {
    const lo = Math.max(100, this.min() || 100);
    const hi = this.max() || 1500;
    const text = normalizar(this.q().trim());
    const lista = this.rooms.all.filter(
      (r) =>
        r.p >= lo &&
        r.p <= hi &&
        (!this.compat() || nivel(r.m) === this.compat()) &&
        this.svc().every((s) => r.s.includes(s)) &&
        (!text || normalizar(r.d + ' ' + r.t).includes(text)),
    );
    return [...lista].sort((a, b) =>
      this.sort() === 'm' ? b.m - a.m : this.sort() === 'pa' ? a.p - b.p : b.p - a.p,
    );
  });

  constructor() {
    // Viene de la Landing: ?q=Surco
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) this.q.set(q);
  }

  toggleSvc(value: string) {
    this.svc.update((s) => (s.includes(value) ? s.filter((x) => x !== value) : [...s, value]));
  }

  reset() {
    this.q.set('');
    this.min.set(100);
    this.max.set(1500);
    this.svc.set([]);
    this.compat.set('');
  }
}
