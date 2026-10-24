import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  { path: 'buscar', loadComponent: () => import('./pages/buscar/buscar').then((m) => m.Buscar) },
  { path: 'habitacion', loadComponent: () => import('./pages/habitacion/habitacion').then((m) => m.Habitacion) },
  { path: 'estudiante', loadComponent: () => import('./pages/estudiante/estudiante').then((m) => m.Estudiante) },
  { path: 'mensajes', loadComponent: () => import('./pages/mensajes/mensajes').then((m) => m.Mensajes) },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil) },
  { path: 'anfitrion', loadComponent: () => import('./pages/anfitrion/anfitrion').then((m) => m.Anfitrion) },
  { path: 'publicar', loadComponent: () => import('./pages/publicar/publicar').then((m) => m.Publicar) },
  { path: '**', redirectTo: 'login' },
];
