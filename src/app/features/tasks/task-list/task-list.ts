import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskApiService } from '../../../services/task-api-service';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private readonly taskApiService = inject(TaskApiService);

  protected readonly tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskApiService.getTasks().subscribe((response) => {
      this.tasks.set(response.content);
    });
  }
}
