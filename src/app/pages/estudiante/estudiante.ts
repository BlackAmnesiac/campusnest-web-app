import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomCard } from '../../shared/room-card';
import { Rooms } from '../../core/rooms';

@Component({
  selector: 'app-estudiante',
  imports: [RouterLink, RoomCard],
  templateUrl: './estudiante.html',
})
export class Estudiante {
  tab = signal('visitas');
  rooms = inject(Rooms);
}
