import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskApiService } from '../../../services/task-api-service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { isApiError } from '../../../models/api-error';

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
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected onSubmit(): void {
    if (this.taskForm.invalid || this.isSubmitting()) {
      if (this.taskForm.invalid) {
        this.taskForm.markAllAsTouched();
      }
      return;
    }
    this.isSubmitting.set(true);
    this.submitError.set(null);

    const taskData = this.taskForm.getRawValue();
    this.taskApiService
      .createTask(taskData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (httpError: HttpErrorResponse) => {
          const body: unknown = httpError.error;

          if (!isApiError(body)) {
            this.submitError.set('Failed to create task.');
            return;
          }

          const fieldEntries = Object.entries(body.fieldErrors);

          if (body.code === 'VALIDATION_ERROR' && fieldEntries.length > 0) {
            fieldEntries.forEach(([field, message]) => {
              const control = this.taskForm.get(field);

              if (control) {
                control.setErrors({
                  ...control.errors,
                  backend: message,
                });
                control.markAsTouched();
              }
            });

            return;
          }

          this.submitError.set(body.message);
        },
      });
  }
}
