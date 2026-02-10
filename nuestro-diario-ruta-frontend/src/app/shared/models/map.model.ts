import { EntryCategory } from './entry.model';

export interface MapMarker {
  id: number;
  title: string;
  category: EntryCategory;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  event_date: string;
  has_media: boolean;
  preview_image?: string | null;
}

export interface MapStats {
  total_places: number;
  by_category: Record<string, number>;
}
