import { User } from './user.model';
import { Media } from './media.model';
import { Comment } from './comment.model';

export type EntryCategory = 'carta' | 'cita' | 'agradecimiento' | 'aniversario' | 'otro';
export type EntryStatus = 'publicado' | 'borrador';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  map_url?: string;
}

export interface Entry {
  id: number;
  title: string;
  content: string;
  event_date: string;
  category: EntryCategory;
  status: EntryStatus;
  author?: User;
  location?: Location;
  media_count?: number;
  has_media?: boolean;
  comments_count?: number;
  media?: Media[];
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface EntryFilters {
  category?: EntryCategory;
  start_date?: string;
  end_date?: string;
  status?: EntryStatus;
}

export interface CreateEntryRequest {
  title: string;
  content: string;
  event_date: string;
  category: EntryCategory;
  status: EntryStatus;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  media?: File[];
  media_descriptions?: string[];
}

export interface UpdateEntryRequest {
  title?: string;
  content?: string;
  event_date?: string;
  category?: EntryCategory;
  status?: EntryStatus;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CategoryOption {
  value: EntryCategory;
  label: string;
}
