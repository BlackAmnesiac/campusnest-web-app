import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiError } from './api-error';
import { ApplicationDto, PropertyDto, RoomDto, VisitDto } from './models';
import { Toast } from './toast';

const api = environment.apiUrl;

export interface ListingForm {
  /** 0 = crear una propiedad nueva */
  propertyId: number;
  title: string;
  address: string;
  districtId: number;
  roomName: string;
  description: string;
  price: number;
  furnished: boolean;
  privateBathroom: boolean;
  serviceIds: number[];
}


/** Panel del anfitrión: propiedades, solicitudes y visitas. */
@Injectable({ providedIn: 'root' })
export class Host {
  private http = inject(HttpClient);
  private toast = inject(Toast);

  properties = signal<PropertyDto[]>([]);
  applications = signal<ApplicationDto[]>([]);
  visits = signal<VisitDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  roomRows = computed(() =>
    this.properties().flatMap((p) => p.rooms.map((r) => ({ ...r, district: p.district, propertyTitle: p.title }))),
  );
  activeRooms = computed(() => this.roomRows().filter((r) => r.status === 'AVAILABLE').length);
  pendingApplications = computed(() => this.applications().filter((a) => a.status === 'PENDING').length);
  pendingVisits = computed(() => this.visits().filter((v) => v.status === 'PROPOSED').length);
  occupancy = computed(() => {
    const rows = this.roomRows();
    return rows.length ? Math.round((rows.filter((r) => r.status === 'OCCUPIED').length / rows.length) * 100) : 0;
  });

  /** GET /api/properties/mine y, por cada habitación, sus solicitudes y visitas. */
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<PropertyDto[]>(`${api}/properties/mine`)
      .pipe(
        switchMap((props) => {
          this.properties.set(props);
          const ids = props.flatMap((p) => p.rooms.map((r) => r.id));
          if (!ids.length) return of({ apps: [] as ApplicationDto[][], vis: [] as VisitDto[][] });
          return forkJoin({
            apps: forkJoin(ids.map((id) => this.http.get<ApplicationDto[]>(`${api}/rooms/${id}/applications`))),
            vis: forkJoin(ids.map((id) => this.http.get<VisitDto[]>(`${api}/rooms/${id}/visits`))),
          });
        }),
      )
      .subscribe({
        next: ({ apps, vis }) => {
          this.applications.set(apps.flat());
          this.visits.set(vis.flat());
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(apiError(err));
          this.loading.set(false);
        },
      });
  }

  /* Funcion para desactivar y activar el status de la habitacion US08*/
  /** PATCH /api/rooms/{id}/status */
  setStatus(roomId: number, status: string) {
    this.act(this.http.patch<RoomDto>(`${api}/rooms/${roomId}/status`, { status }), 'Estado actualizado');
  }

  // feat(anfitrion): agregar pestaña de solicitudes recibidas con habitos del solicitante

  /** PATCH /api/applications/{id}/status (ACCEPTED o REJECTED) */
  decideApplication(id: number, status: string, onOk?: () => void) {
    this.act(this.http.patch(`${api}/applications/${id}/status`, { status }), 'Solicitud actualizada', onOk);
  }
  // Se modifica el estado de la solicitud de una habitacion, ya sea aceptandola o rechazandola. Se hace un PATCH a la API con el id de la solicitud y el nuevo estado.
  /** PATCH /api/visits/{id}/status (APPROVED o REJECTED) */
  decideVisit(id: number, status: string) {
    this.act(this.http.patch(`${api}/visits/${id}/status`, { status }), 'Visita actualizada');
  }

  // feat(anfitrion): agregar asistente para publicar habitacion

  /** POST /api/properties -> POST /api/properties/{id}/rooms -> PUT /api/rooms/{id}/services */
  createListing(f: ListingForm): Observable<RoomDto> {
    const property$: Observable<{ id: number }> = f.propertyId
      ? of({ id: f.propertyId })
      : this.http.post<PropertyDto>(`${api}/properties`, {
          title: f.title,
          exactAddress: f.address,
          districtId: f.districtId,
        });
    return property$.pipe(
      switchMap((p) =>
        this.http.post<RoomDto>(`${api}/properties/${p.id}/rooms`, {
          name: f.roomName,
          description: f.description,
          monthlyPrice: f.price,
          furnished: f.furnished,
          privateBathroom: f.privateBathroom,
        }),
      ),
      switchMap((room) =>
        f.serviceIds.length
          ? this.http.put<RoomDto>(`${api}/rooms/${room.id}/services`, { serviceIds: f.serviceIds })
          : of(room),
      ),
    );
  }

  private act(request: Observable<unknown>, okMessage: string, onOk?: () => void) {
    request.subscribe({
      next: () => {
        this.toast.show(okMessage);
        this.load();
        onOk?.();
      },
      error: (err) => this.toast.show(apiError(err)),
    });
  }
}
