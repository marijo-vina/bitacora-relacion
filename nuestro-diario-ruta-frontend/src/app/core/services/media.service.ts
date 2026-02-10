import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Media } from '../../shared/models/media.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  uploadMedia(entryId: number, files: File[], descriptions: string[] = []): Observable<ApiResponse<Media[]>> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('files[]', file);
      if (descriptions[index]) {
        formData.append('descriptions[]', descriptions[index]);
      }
    });

    return this.http.post<ApiResponse<Media[]>>(`${this.apiUrl}/entries/${entryId}/media`, formData);
  }

  updateDescription(mediaId: number, description: string | null): Observable<ApiResponse<Media>> {
    return this.http.put<ApiResponse<Media>>(`${this.apiUrl}/media/${mediaId}/description`, { description });
  }

  reorderMedia(entryId: number, order: number[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/entries/${entryId}/media/reorder`, { order });
  }

  deleteMedia(mediaId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/media/${mediaId}`);
  }
}
