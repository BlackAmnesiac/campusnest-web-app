import { Component, inject, signal } from '@angular/core';
import { Seg, Chip } from '../../shared/directives';
import { Toast } from '../../core/toast';

@Component({
  selector: 'app-publicar',
  imports: [Seg, Chip],
  templateUrl: './publicar.html',
})
export class Publicar {
  toast = inject(Toast);
  tab = signal('a');
}
