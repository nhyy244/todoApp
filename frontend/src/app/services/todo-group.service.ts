import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoGroup } from '../models/todo-group';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoGroupService {
  private apiUrl = `${environment.apiUrl}/api/groups`;

  constructor(private http: HttpClient) { }

  getGroups(): Observable<TodoGroup[]> {
    return this.http.get<TodoGroup[]>(this.apiUrl);
  }

  getGroup(id: number): Observable<TodoGroup> {
    return this.http.get<TodoGroup>(`${this.apiUrl}/${id}`);
  }

  createGroup(group: Partial<TodoGroup>): Observable<TodoGroup> {
    return this.http.post<TodoGroup>(this.apiUrl, group);
  }

  updateGroup(id: number, group: Partial<TodoGroup>): Observable<TodoGroup> {
    return this.http.put<TodoGroup>(`${this.apiUrl}/${id}`, group);
  }

  deleteGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
