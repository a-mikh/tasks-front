import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../models/task';
import { PageResponse } from '../models/page-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly baseUrl = '/tasks';
  private readonly httpClient = inject(HttpClient);

  getTasks(): Observable<PageResponse<Task>> {
    return this.httpClient.get<PageResponse<Task>>(this.baseUrl);
  }
}
