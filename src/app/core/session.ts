import { Injectable, signal } from '@angular/core';

export type Role = 'student' | 'host';

/** Estado de la sesión (demo, sin backend todavía). */
@Injectable({ providedIn: 'root' })
export class Session {
  /** Rol con el que se usa la aplicación. */
  role = signal<Role>('student');
  /** Rol elegido en el registro. */
  regRole = signal<Role>('student');
}
