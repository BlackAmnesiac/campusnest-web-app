import { Component, computed, inject, signal } from '@angular/core';
import { apiError } from '../../core/api-error';
import { Catalog } from '../../core/catalog';
import { Host } from '../../core/host';
import { Toast } from '../../core/toast';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.html',
})
export class Publicar {
  private toast = inject(Toast);
  host = inject(Host);
  catalog = inject(Catalog);

  tab = signal('a');
  busy = signal(false);
  error = signal('');

  propertyId = signal(0);
  title = signal('');
  address = signal('');
  districtId = signal(0);
  roomName = signal('');
  description = signal('');
  furnished = signal(false);
  bath = signal(false);
  price = signal(0);
  serviceIds = signal<number[]>([]);

  districtName = computed(() => {
    const prop = this.host.properties().find((p) => p.id === this.propertyId());
    if (prop) return prop.district;
    return this.catalog.districts().find((d) => d.id === this.districtId())?.name ?? 'Distrito';
  });

  constructor() {
    this.catalog.load();
    this.host.load();
  }

  toggleService(id: number) {
    this.serviceIds.update((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  }

  /** Crea la propiedad (si es nueva), la habitación y sus servicios en el backend. */
  publish() {
    const newProperty = this.propertyId() === 0;
    if (newProperty && (!this.title().trim() || !this.address().trim() || !this.districtId())) {
      this.error.set('En el paso 1 completa el título, el distrito y la dirección.');
      return;
    }
    if (!this.roomName().trim()) {
      this.error.set('En el paso 2 escribe el nombre de la habitación.');
      return;
    }
    if (this.price() < 100) {
      this.error.set('El precio mensual debe ser de S/ 100 o más.');
      return;
    }
    this.error.set('');
    this.busy.set(true);
    this.host
      .createListing({
        propertyId: this.propertyId(),
        title: this.title().trim(),
        address: this.address().trim(),
        districtId: this.districtId(),
        roomName: this.roomName().trim(),
        description: this.description().trim(),
        price: this.price(),
        furnished: this.furnished(),
        privateBathroom: this.bath(),
        serviceIds: this.serviceIds(),
      })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.toast.show('Habitación publicada', '/anfitrion');
        },
        error: (err) => {
          this.busy.set(false);
          this.error.set(apiError(err));
        },
      });
  }
}
