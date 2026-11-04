import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/auth';
import { Toast } from './core/toast';
import { Navbar } from './layout/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
})
export class App {
  toast = inject(Toast);
  /** Se crea al iniciar para recuperar la sesión guardada. */
  auth = inject(Auth);
}
