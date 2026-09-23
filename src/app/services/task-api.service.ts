import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../models/task';
import { PageResponse } from '../models/page-response';
import { Observable } from 'rxjs';
import { TaskCreateRequest } from '../models/task-create-request';
import { TaskStatus } from '../models/task-status';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly baseUrl = '/tasks';
  private readonly httpClient = inject(HttpClient);

  getTasks(status?: TaskStatus): Observable<PageResponse<Task>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }

    return this.httpClient.get<PageResponse<Task>>(this.baseUrl, { params });
  }

  createTask(task: TaskCreateRequest): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl, task);
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}/${taskId}`);
  }

  moveToNextStatus(taskId: number): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.baseUrl}/${taskId}/status/next`, null);
  }
}
