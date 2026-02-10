import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Entry, 
  EntryFilters, 
  CreateEntryRequest, 
  UpdateEntryRequest,
  CategoryOption 
} from '../../shared/models/entry.model';
import { ApiResponse, PaginatedResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getEntries(filters?: EntryFilters, page: number = 1): Observable<PaginatedResponse<Entry>> {
    let params = new HttpParams().set('page', page.toString());
    
    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.start_date) {
        params = params.set('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params = params.set('end_date', filters.end_date);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
    }

    return this.http.get<PaginatedResponse<Entry>>(`${this.apiUrl}/entries`, { params });
  }

  getEntry(id: number): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.apiUrl}/entries/${id}`);
  }

  createEntry(entry: CreateEntryRequest): Observable<ApiResponse<Entry>> {
    const formData = this.buildFormData(entry);
    return this.http.post<ApiResponse<Entry>>(`${this.apiUrl}/entries`, formData);
  }

  updateEntry(id: number, entry: UpdateEntryRequest): Observable<ApiResponse<Entry>> {
    return this.http.put<ApiResponse<Entry>>(`${this.apiUrl}/entries/${id}`, entry);
  }

  deleteEntry(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/entries/${id}`);
  }

  publishEntry(id: number): Observable<ApiResponse<Entry>> {
    return this.http.post<ApiResponse<Entry>>(`${this.apiUrl}/entries/${id}/publish`, {});
  }

  getCategories(): Observable<ApiResponse<CategoryOption[]>> {
    return this.http.get<ApiResponse<CategoryOption[]>>(`${this.apiUrl}/entries/categories`);
  }

  private buildFormData(entry: CreateEntryRequest): FormData {
    const formData = new FormData();
    
    formData.append('title', entry.title);
    formData.append('content', entry.content);
    formData.append('event_date', entry.event_date);
    formData.append('category', entry.category);
    formData.append('status', entry.status);

    if (entry.location_name) {
      formData.append('location_name', entry.location_name);
    }
    if (entry.latitude !== undefined) {
      formData.append('latitude', entry.latitude.toString());
    }
    if (entry.longitude !== undefined) {
      formData.append('longitude', entry.longitude.toString());
    }

    if (entry.media && entry.media.length > 0) {
      entry.media.forEach((file, index) => {
        formData.append('media[]', file);
        if (entry.media_descriptions && entry.media_descriptions[index]) {
          formData.append('media_descriptions[]', entry.media_descriptions[index]);
        }
      });
    }

    return formData;
  }
}
