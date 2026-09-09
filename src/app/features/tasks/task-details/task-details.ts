import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskApiService } from '../../../services/task-api-service';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tasksService = inject(TaskApiService);

  protected readonly task = signal<Task | null>(null);

  ngOnInit(): void {
    this.loadTaskDetails();
  }

  private loadTaskDetails(): void {
    const taskId = Number(this.activatedRoute.snapshot.paramMap.get('taskId'));
    this.tasksService.getTaskById(taskId).subscribe((task) => {
      this.task.set(task);
    });
  }
}
