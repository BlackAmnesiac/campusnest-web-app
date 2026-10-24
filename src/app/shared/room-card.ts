import { Component, computed, inject, input } from '@angular/core';
import { Room, Rooms } from '../core/rooms';

/**
 * Tarjeta de habitación. Se usa sobre un enlace:
 * <a class="card" routerLink="/habitacion" roomCard [room]="r"></a>
 */
@Component({
  selector: 'a[roomCard]',
  template: `
    <div class="ph">
      <svg><use href="#room" /></svg>
      @if (room().m >= 90) {
        <span class="tag flag">Top match</span>
      }
      <button class="fav" [class.on]="fav()" (click)="toggle($event)" aria-label="Favorito">
        {{ fav() ? '♥' : '♡' }}
      </button>
    </div>
    <div class="in">
      <div class="lo"><svg aria-hidden="true"><use href="#pin" /></svg>{{ room().d }}, Lima</div>
      <div class="ti" [title]="room().t">{{ room().t }}</div>
      <div class="ft">
        <span class="tag" [class.hi]="room().m >= 80">{{ room().m }}% match</span>
        @if (room().s.length >= 4) {
          <span class="tag mut">Todo incluido</span>
        }
      </div>
      <div class="buy">
        <div class="pr num">S/ {{ room().p }} <small>/ mes</small></div>
        <span class="btn btn-primary btn-sm">Ver más</span>
      </div>
    </div>
  `,
})
export class RoomCard {
  private rooms = inject(Rooms);
  room = input.required<Room>();
  fav = computed(() => this.rooms.isFav(this.room().id));

  toggle(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.rooms.toggleFav(this.room().id);
  }
}
