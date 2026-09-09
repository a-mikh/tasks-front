import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskApiService } from '../../../services/task-api-service';
import { Task } from '../../../models/task';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

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

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.taskApiService
      .getTasks()
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
}
