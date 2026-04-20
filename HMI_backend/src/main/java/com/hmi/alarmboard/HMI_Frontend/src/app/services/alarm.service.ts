import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EventRecord, Summary, PageResponse } from '../Components/alarm.models';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  
  private apiUrl = 'http://localhost:8090/api/events'; 

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/alarms/summary`);
  }

  getFilteredEvents(
    page: number = 0, 
    size: number = 10, 
    severity?: string, 
    state?: string
  ): Observable<PageResponse<EventRecord>> {
    
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

   
    if (severity && severity !== 'All') {
      params = params.set('severity', severity.toUpperCase()); 
    }
    if (state && state !== 'All') {
      params = params.set('state', state.toUpperCase()); 
    }

   
    return this.http.get<PageResponse<EventRecord>>(`${this.apiUrl}/filter`, { params });
  }

  acknowledge(id: number): Observable<any> {
    
    return this.http.put(`${this.apiUrl}/${id}/acknowledge`, {});
  }

  clear(id: number): Observable<any> {
    
    return this.http.put(`${this.apiUrl}/${id}/clear`, {});
  }
}