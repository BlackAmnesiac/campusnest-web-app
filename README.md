# CampusNest — Web Application

Frontend de **CampusNest** hecho con **Angular**: la aplicación que usan estudiantes buscadores y estudiantes anfitriones. Primera versión navegable con datos de ejemplo; todavía no está conectada al backend.

## Pantallas

Inicio de sesión · Registro (rol, cuenta, perfil de convivencia) · Búsqueda con filtros y favoritos · Detalle de habitación · Panel del estudiante · Mensajes · Mi perfil de convivencia · Panel del anfitrión · Publicar habitación.

Navbar según rol (público, estudiante, anfitrión), botones, cards, formularios y tablas, con tema oscuro y diseño responsive.

## Cómo ejecutarlo

```bash
npm install
ng serve
```

Abrir http://localhost:4200. Requiere Node.js y Angular CLI (`npm install -g @angular/cli`).

## Estructura (`src/app`)

```
app.ts / app.html      ← componente raíz (navbar + pantalla actual + mensajes)
app.routes.ts          ← rutas de las pantallas
app.config.ts          ← configuración (rutas con #, scroll al inicio)
config.ts              ← URL de la Landing Page
core/                  ← servicios: session (rol), toast (mensajes), rooms (habitaciones y favoritos)
layout/navbar.*        ← navbar pública / estudiante / anfitrión
shared/                ← room-card (tarjeta de habitación) y directivas de botones
pages/                 ← una carpeta por pantalla (login, registro, buscar, ...)
```

## Guía de estilo

Los colores están como variables CSS al inicio de `src/styles.css` y se usan siempre con variables. Primario (`--primary`): navbar, marca y botones principales. Secundario (`--secondary`): botones secundarios, enlaces y elementos interactivos. Detalle en [docs/guia-de-estilo.md](docs/guia-de-estilo.md).

## Próximos pasos

- Conectar con la API del backend (`http://localhost:8081/api`): login, registro, búsqueda de habitaciones, solicitudes y visitas.
- Reemplazar los datos de ejemplo de `core/rooms.ts`.
- Cuando se publique la Landing, cambiar `LANDING_URL` en `src/app/config.ts`.

## Enlaces

- Diseño en Figma: _(pegar el link)_
- Landing Page: _(pegar el link del repositorio)_
- Backend: https://github.com/andynary/campusnest-web-services

## Integrantes

| Nombre y apellido | Usuario de GitHub |
|---|---|
| _(completar)_ | _(completar)_ |
| _(completar)_ | _(completar)_ |
| _(completar)_ | _(completar)_ |
| _(completar)_ | _(completar)_ |

## Convención de commits

Conventional Commits, igual que en el backend: `feat(ui): add search page`, `fix(css): ...`, `docs: ...`, `chore: ...`.
