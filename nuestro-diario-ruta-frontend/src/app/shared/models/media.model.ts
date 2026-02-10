export type FileType = 'image' | 'video';

export interface Media {
  id: number;
  url: string;
  file_type: FileType;
  description: string | null;
  display_order: number;
  is_image: boolean;
  is_video: boolean;
  created_at: string;
}

export interface MediaUpload {
  file: File;
  description?: string;
}
