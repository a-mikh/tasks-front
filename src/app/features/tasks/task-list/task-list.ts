import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskApiService } from '../../../services/task-api-service';
import { Task } from '../../../models/task';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TaskStatus } from '../../../models/task-status';

type TaskStatusFilter = TaskStatus | 'ALL';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  imports: [RouterLink],
})
export class TaskList implements OnInit {
  private readonly taskApiService = inject(TaskApiService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly filterStatus = signal<TaskStatusFilter>('ALL');

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const filter = this.filterStatus();
    const status = filter === 'ALL' ? undefined : filter;

    this.taskApiService
      .getTasks(status)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.tasks.set(response.content);
        },
        error: () => {
          this.errorMessage.set('Failed to load tasks.');
        },
      });
  }

  protected handleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterStatus.set(target.value as TaskStatusFilter);
    this.loadTasks();
  }
}
