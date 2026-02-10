import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MapMarker, MapStats } from '../../shared/models/map.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getMarkers(): Observable<ApiResponse<MapMarker[]>> {
    return this.http.get<ApiResponse<MapMarker[]>>(`${this.apiUrl}/map/markers`);
  }

  getStats(): Observable<ApiResponse<MapStats>> {
    return this.http.get<ApiResponse<MapStats>>(`${this.apiUrl}/map/stats`);
  }
}
