import { AvailableSlotItem, LocationItem, PractitionerItem, ServiceItem } from '@/lib/api/client';

export interface BookingState {
  // Selections
  serviceId: string;
  locationId: string;
  practitionerId: string; // empty string means "any doctor"
  selectedDate: string;   // YYYY-MM-DD
  selectedSlot: AvailableSlotItem | null;

  // Contact info
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNote: string;
  consent: boolean;

  // Catalog cache
  services: ServiceItem[];
  locations: LocationItem[];
  practitioners: PractitionerItem[];
}

export type BookingStep = 1 | 2 | 3 | 4;

