/** Textos en español para los estados que devuelve el backend. */
export const APP_STATUS: Record<string, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
};

export const VISIT_STATUS: Record<string, string> = {
  PROPOSED: 'Propuesta',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

export const ROOM_STATUS: Record<string, string> = {
  AVAILABLE: 'Activa',
  OCCUPIED: 'Ocupada',
  HIDDEN: 'Oculta',
  SUSPENDED: 'Suspendida',
};
