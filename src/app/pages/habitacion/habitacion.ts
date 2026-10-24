import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seg, Single } from '../../shared/directives';
import { Toast } from '../../core/toast';

@Component({
  selector: 'app-habitacion',
  imports: [RouterLink, Seg, Single],
  templateUrl: './habitacion.html',
})
export class Habitacion {
  toast = inject(Toast);
}
