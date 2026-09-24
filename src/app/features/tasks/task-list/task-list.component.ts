import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { TaskApiService } from '../../../services/task-api.service';
import { Task } from '../../../models/task';
import { RouterLink } from '@angular/router';
import { EMPTY, Observable, Subject, catchError, finalize, switchMap, tap } from 'rxjs';
import { PageResponse } from '../../../models/page-response';
import { TaskStatus } from '../../../models/task-status';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type TaskStatusFilter = TaskStatus | 'ALL';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  imports: [RouterLink],
})
export class TaskList implements OnInit {
  private readonly taskApiService = inject(TaskApiService);
  private readonly loadRequests$ = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly filterStatus = signal<TaskStatusFilter>('ALL');
  protected readonly currentPage = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalPages = signal(0);

  ngOnInit(): void {
    this.loadRequests$
      .pipe(
        switchMap(() => {
          return this.requestTasks();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.loadTasks();
  }

  protected loadTasks(): void {
    this.loadRequests$.next();
  }

  private requestTasks(): Observable<PageResponse<Task>> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const filter = this.filterStatus();
    const status = filter === 'ALL' ? undefined : filter;

    return this.taskApiService.getTasks(status, this.currentPage(), this.pageSize()).pipe(
      tap((response) => {
        this.tasks.set(response.content);
        this.currentPage.set(response.page);
        this.totalPages.set(response.totalPages);
      }),
      catchError(() => {
        this.errorMessage.set('Failed to load tasks.');
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }

  protected handleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterStatus.set(target.value as TaskStatusFilter);
    this.currentPage.set(0);
    this.loadTasks();
  }

  protected previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadTasks();
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadTasks();
    }
  }
}
