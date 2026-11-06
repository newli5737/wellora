export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown[];
  requestId?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Get token if in browser and available
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('wellora_admin_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = {
      statusCode: response.status,
      code: data.code || 'UNKNOWN_ERROR',
      message: data.message || 'Có lỗi xảy ra khi kết nối máy chủ.',
      details: data.details,
      requestId: data.requestId,
    };
    throw error;
  }

  return data as T;
}

// Public API endpoints
export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  durationMinutes: number;
  priceMinor: number | null;
  currency: string;
  practitioners?: {
    practitioner: {
      id: string;
      displayName: string;
      bio: string | null;
      photoUrl: string | null;
    };
  }[];
}

export interface PractitionerItem {
  id: string;
  displayName: string;
  bio: string | null;
  photoUrl: string | null;
}

export interface LocationItem {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  timezone: string;
}

export interface AvailableSlotItem {
  startsAt: string;
  endsAt: string;
  localTime: string;
  practitionerId?: string;
}

export const api = {
  getServices: () => apiClient<ServiceItem[]>('/public/services'),

  getServiceBySlug: (slug: string) => apiClient<ServiceItem>(`/public/services/${slug}`),

  getPractitioners: (serviceId?: string) =>
    apiClient<PractitionerItem[]>(
      serviceId ? `/public/practitioners?serviceId=${serviceId}` : '/public/practitioners',
    ),

  getLocations: () => apiClient<LocationItem[]>('/public/locations'),

  getAvailability: (params: {
    serviceId: string;
    from: string;
    to: string;
    locationId?: string;
    practitionerId?: string;
  }) => {
    const q = new URLSearchParams({
      serviceId: params.serviceId,
      from: params.from,
      to: params.to,
    });
    if (params.locationId) q.append('locationId', params.locationId);
    if (params.practitionerId) q.append('practitionerId', params.practitionerId);
    return apiClient<{ timezone: string; slots: AvailableSlotItem[] }>(
      `/public/availability?${q.toString()}`,
    );
  },

  createAppointment: (payload: {
    serviceId: string;
    locationId?: string;
    practitionerId?: string;
    startsAt: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientNote?: string;
    consent: boolean;
  }) =>
    apiClient<{
      reference: string;
      status: string;
      serviceName: string;
      practitionerName: string;
      startsAt: string;
      endsAt: string;
      locationName: string;
      locationAddress: string | null;
      priceMinor: number | null;
      currency: string;
      message: string;
    }>('/public/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAppointmentStatus: (reference: string) =>
    apiClient<{
      reference: string;
      status: string;
      startsAt: string;
      endsAt: string;
      service: { name: string; durationMinutes: number };
      location: { name: string; address: string | null };
      createdAt: string;
    }>(`/public/appointments/status/${reference}`),

  // Admin APIs
  login: (credentials: { email: string; password: string }) =>
    apiClient<{
      accessToken: string;
      user: { id: string; email: string; role: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getAdminAppointments: (params: {
    from?: string;
    to?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const q = new URLSearchParams();
    if (params.from) q.append('from', params.from);
    if (params.to) q.append('to', params.to);
    if (params.status) q.append('status', params.status);
    if (params.page) q.append('page', String(params.page));
    if (params.pageSize) q.append('pageSize', String(params.pageSize));

    return apiClient<{
      data: any[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }>(`/admin/appointments?${q.toString()}`);
  },

  getAdminAppointmentById: (id: string) =>
    apiClient<any>(`/admin/appointments/${id}`),

  updateAppointmentStatus: (id: string, status: string, reason?: string) =>
    apiClient<any>(`/admin/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
};

