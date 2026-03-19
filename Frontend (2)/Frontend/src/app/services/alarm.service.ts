import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Make sure you have exported PageResponse in your alarm.models.ts file!
import { EventRecord, Summary, PageResponse } from '../Components/alarm.models';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  // Matched to your AlarmEventController base path
  private apiUrl = 'http://localhost:8090/api/events'; 

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> {
    // Matched to @GetMapping("/alarms/summary")
    return this.http.get<any>(`${this.apiUrl}/alarms/summary`);
  }

  // 👇 FIX: New paginated and filtered API call
  getFilteredEvents(
    page: number = 0, 
    size: number = 10, 
    severity?: string, 
    state?: string
  ): Observable<PageResponse<EventRecord>> {
    
    // Set standard pagination parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Safely append filters only if they are selected and not 'All'
    if (severity && severity !== 'All') {
      params = params.set('severity', severity.toUpperCase()); // Spring Boot Enum expects uppercase
    }
    if (state && state !== 'All') {
      params = params.set('state', state.toUpperCase()); // Spring Boot Enum expects uppercase
    }

    // Matches @GetMapping("/filter")
    return this.http.get<PageResponse<EventRecord>>(`${this.apiUrl}/filter`, { params });
  }

  acknowledge(id: number): Observable<any> {
    // Matches @PutMapping("/{id}/acknowledge")
    return this.http.put(`${this.apiUrl}/${id}/acknowledge`, {});
  }

  clear(id: number): Observable<any> {
    // Matches @PutMapping("/{id}/clear")
    return this.http.put(`${this.apiUrl}/${id}/clear`, {});
  }
}