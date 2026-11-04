import { HttpErrorResponse } from '@angular/common/http';

/** Convierte un error del backend en un mensaje legible para el usuario. */
export function apiError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se pudo conectar con el servidor. ¿Está encendido el backend?';
    const msg = (err.error as { message?: string } | null)?.message;
    if (msg) return msg;
    if (err.status === 401) return 'Tu sesión venció. Inicia sesión otra vez.';
    if (err.status === 403) return 'No tienes permiso para hacer esto.';
  }
  return 'Ocurrió un error inesperado.';
}
