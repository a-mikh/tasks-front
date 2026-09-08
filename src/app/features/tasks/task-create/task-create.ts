import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskApiService } from '../../../services/task-api-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
  imports: [ReactiveFormsModule],
})
export class TaskCreate {
  private readonly taskApiService = inject(TaskApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
    description: ['', Validators.maxLength(1000)],
  });

  onSubmit(): void {
    if (!this.taskForm.valid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData = this.taskForm.getRawValue();
    this.taskApiService.createTask(taskData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
