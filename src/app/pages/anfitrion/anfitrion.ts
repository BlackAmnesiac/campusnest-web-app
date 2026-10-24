import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-anfitrion',
  imports: [RouterLink],
  templateUrl: './anfitrion.html',
})
export class Anfitrion {
  tab = signal('solic');
}
