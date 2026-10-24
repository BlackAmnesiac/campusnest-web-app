import { Component, inject } from '@angular/core';
import { Seg, Chip } from '../../shared/directives';
import { Toast } from '../../core/toast';

@Component({
  selector: 'app-perfil',
  imports: [Seg, Chip],
  templateUrl: './perfil.html',
})
export class Perfil {
  toast = inject(Toast);
}
