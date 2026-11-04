/** Formatos de datos que devuelve el backend. */
export interface Named {
  id: number;
  name: string;
}

export interface RoomDto {
  id: number;
  propertyId: number;
  name: string;
  description: string;
  monthlyPrice: number;
  furnished: boolean;
  privateBathroom: boolean;
  status: string;
  services: string[];
}

export interface PropertyDto {
  id: number;
  title: string;
  district: string;
  rooms: RoomDto[];
}

export interface ApplicationDto {
  id: number;
  roomId: number;
  roomName: string;
  applicantId: number;
  applicantName: string;
  university: string | null;
  cleanlinessLevel: number | null;
  noiseLevel: number | null;
  sleepSchedule: string | null;
  studyRoutine: string | null;
  status: string;
  createdAt: string;
}

export interface VisitDto {
  id: number;
  roomId: number;
  roomName: string;
  visitorId: number;
  visitorName: string;
  visitDateTime: string;
  status: string;
}
