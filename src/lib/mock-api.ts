import axios from 'axios';

const api = axios.create({baseURL: import.meta.env.VITE_API_URL || '/api'});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  longDescription: string;
  status: 'upcoming' | 'soon' | "finished";
  topics: string[];
  image?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  storagePath?: string;
  type?: string;
  sortOrder?: number;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  link?: string;
  image?: string;
}

export interface TeamMember {
  id: string;
  nome: string;
  idade: number;
  papel: string;
  foto?: string;
  redes_sociais: SocialLink[];
}

export type SocialIcon = 'link' | 'linkedin' | 'facebook' | 'github' | 'instagram';

export interface SocialLink {
  url: string;
  icone: SocialIcon;
}

export interface SiteText {
  id: string;
  key: string;
  label: string;
  value: string;
}

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt?: string;
}

const crud = <T>(resource: string) => ({
  getAll: async (): Promise<T[]> => (await api.get<T[]>(`/${resource}`)).data,
  getOne: async (id: string): Promise<T> => (await api.get<T>(`/${resource}/${id}`)).data,
  create: async (data: Omit<T, 'id'>): Promise<T> => (await api.post<T>(`/${resource}`, data)).data,
  update: async (id: string, data: Partial<T>): Promise<T> => (await api.patch<T>(`/${resource}/${id}`, data)).data,
  delete: async (id: string): Promise<void> => {
    await api.delete(`/${resource}/${id}`);
  },
});
export const eventsApi = crud<EventItem>('events');
export const workshopsApi = crud<EventItem>('workshops');
export const galleryApi = crud<GalleryPhoto>('gallery');
export const partnersApi = crud<Partner>('partners');
export const teamApi = crud<TeamMember>('team');
export const textsApi = crud<SiteText>('texts');
export const contactsApi = crud<ContactItem>('contacts');
export const uploadsApi = {
  upload: async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return (await api.post<{ url: string; path: string; type: string }>('/uploads', body)).data;
  },
  uploadImage: async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return (await api.post<{ url: string; path: string; type: string }>('/uploads/images', body)).data;
  }
};
export const siteConfigApi = {
  getAll: async (): Promise<Record<string, unknown>> => (await api.get<Record<string, unknown>>('/config')).data,
  set: async (key: string, value: unknown) => (await api.put<{key: string; value: unknown}>(`/config/${encodeURIComponent(key)}`, {value})).data,
};
export default api;
