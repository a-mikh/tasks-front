import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskApiService } from '../../../services/task-api-service';
import { Task } from '../../../models/task';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { isApiError } from '../../../models/api-error';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tasksService = inject(TaskApiService);

  protected readonly task = signal<Task | null>(null);
  protected readonly canAdvanceStatus = computed(() => {
    const task = this.task();
    return task !== null && task.status !== 'DONE';
  });
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTaskDetails();
  }

  protected loadTaskDetails(): void {
    const taskIdParam = this.activatedRoute.snapshot.paramMap.get('taskId');

    if (taskIdParam === null) {
      this.errorMessage.set('Invalid task id.');
      return;
    }

    const taskId = Number(taskIdParam);

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
      this.errorMessage.set('Invalid task id.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.tasksService
      .getTaskById(taskId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (task) => {
          this.task.set(task);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.errorMessage.set('Task not found.');
          } else {
            this.errorMessage.set('Failed to load task.');
          }
        },
      });
  }

  protected moveToNextStatus(taskId: number): void {
    if (!this.canAdvanceStatus()) {
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.tasksService
      .moveToNextStatus(taskId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (task) => {
          this.task.set(task);
        },
        error: (httpError: HttpErrorResponse) => {
          const body: unknown = httpError.error;

          if (!isApiError(body)) {
            this.errorMessage.set('Failed to update task status.');
            return;
          }

          this.errorMessage.set(body.message);
        },
      });
  }
}
