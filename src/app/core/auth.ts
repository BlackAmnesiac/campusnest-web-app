import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Session } from './session';

export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'SEEKER' | 'HOST' | 'ADMIN';
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'SEEKER' | 'HOST';
  university?: string;
  cleanlinessLevel?: number;
  noiseLevel?: number;
  sleepSchedule?: string;
  studyRoutine?: string;
}

interface StoredProfile {
  userId: number;
  cleanliness?: number;
  noise?: number;
}

const AUTH_KEY = 'campusnest-auth';
const PROFILE_KEY = 'campusnest-profile';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sin almacenamiento: la sesión solo dura esta visita
  }
}

/** Login, registro y sesión (el token JWT se guarda en el navegador). */
@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private session = inject(Session);
  private url = environment.apiUrl + '/auth';

  user = signal<AuthResponse | null>(read<AuthResponse>(AUTH_KEY));
  token = computed(() => this.user()?.token ?? null);

  private stored = signal<StoredProfile | null>(read<StoredProfile>(PROFILE_KEY));
  /** Hábitos de convivencia del usuario actual (para calcular el % de match). */
  profile = computed(() => {
    const p = this.stored();
    return p && p.userId === this.user()?.userId ? p : undefined;
  });

  constructor() {
    this.syncRole(this.user());
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, { email, password })
      .pipe(tap((r) => this.save(r)));
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthResponse>(`${this.url}/register`, payload).pipe(
      tap((r) => {
        this.save(r);
        const profile: StoredProfile = {
          userId: r.userId,
          cleanliness: payload.cleanlinessLevel,
          noise: payload.noiseLevel,
        };
        this.stored.set(profile);
        write(PROFILE_KEY, profile);
      }),
    );
  }

  /** Borra la sesión guardada sin navegar. */
  clear() {
    this.user.set(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // nada que borrar
    }
  }

  logout() {
    this.clear();
    this.router.navigateByUrl('/login');
  }

  private save(r: AuthResponse) {
    this.user.set(r);
    write(AUTH_KEY, r);
    this.syncRole(r);
  }

  private syncRole(r: AuthResponse | null) {
    if (r) this.session.role.set(r.role === 'HOST' ? 'host' : 'student');
  }
}
