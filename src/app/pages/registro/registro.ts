import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { apiError } from '../../core/api-error';
import { Auth, RegisterPayload } from '../../core/auth';
import { Session } from '../../core/session';
import { Seg } from '../../shared/directives';

interface Form {
  nombres: string;
  apellidos: string;
  universidad: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-registro',
  imports: [RouterLink, Seg],
  templateUrl: './registro.html',
})
export class Registro {
  private router = inject(Router);
  private auth = inject(Auth);
  private session = inject(Session);

  role = this.session.regRole;
  pane = signal('rol');
  loading = signal(false);
  error = signal('');

  /** Paso resaltado en la barra de progreso: 0 rol, 1 cuenta, 2 perfil. */
  step = computed(() => {
    const pasos: Record<string, number> = { rol: 0, cuenta: 1, 'perfil-student': 2, 'perfil-host': 2, listo: 2 };
    return pasos[this.pane()];
  });

  data = signal<Form>({ nombres: '', apellidos: '', universidad: '', email: '', password: '' });

  // Perfil de convivencia (estudiante buscador)
  schedules = ['Madrugador', 'Flexible', 'Nocturno'];
  cleanOpts = [
    { label: 'Relajado', value: 2 },
    { label: 'Normal', value: 3 },
    { label: 'Muy ordenado', value: 5 },
  ];
  noiseOpts = [
    { label: 'Tranquilo', value: 1 },
    { label: 'Normal', value: 3 },
    { label: 'Ruidoso', value: 5 },
  ];
  interestOpts = ['Estudio en casa', 'Deporte', 'Música', 'Cocinar', 'Mascotas'];

  schedule = signal('Madrugador');
  clean = signal(3);
  noise = signal(3);
  interests = signal<string[]>(['Estudio en casa']);

  constructor() {
    // Viene de la Landing: ?role=host
    const r = new URLSearchParams(window.location.search).get('role');
    if (r === 'host' || r === 'student') this.role.set(r);
  }

  set(key: keyof Form, value: string) {
    this.data.update((d) => ({ ...d, [key]: value }));
  }

  toggleInterest(c: string) {
    this.interests.update((l) => (l.includes(c) ? l.filter((x) => x !== c) : [...l, c]));
  }

  /** Paso 2 -> 3: valida los datos de la cuenta antes de seguir. */
  toProfile() {
    const d = this.data();
    if (!d.nombres.trim() || !d.email.trim()) {
      this.error.set('Completa tu nombre y tu correo institucional.');
      return;
    }
    if (d.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.error.set('');
    this.pane.set('perfil-' + this.role());
  }

  /** Crea la cuenta en el backend (POST /api/auth/register). */
  submit() {
    const d = this.data();
    const seeker = this.role() === 'student';
    const payload: RegisterPayload = {
      fullName: `${d.nombres} ${d.apellidos}`.trim(),
      email: d.email.trim(),
      password: d.password,
      role: seeker ? 'SEEKER' : 'HOST',
      university: d.universidad.trim() || undefined,
      ...(seeker
        ? {
            cleanlinessLevel: this.clean(),
            noiseLevel: this.noise(),
            sleepSchedule: this.schedule(),
            studyRoutine: this.interests().join(', '),
          }
        : {}),
    };
    this.error.set('');
    this.loading.set(true);
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.pane.set('listo');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(apiError(err));
        this.pane.set('cuenta');
      },
    });
  }

  goDash() {
    this.router.navigateByUrl(this.role() === 'host' ? '/anfitrion' : '/buscar');
  }
}
