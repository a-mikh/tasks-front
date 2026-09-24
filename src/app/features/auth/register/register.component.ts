import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../services/auth-api.service';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { isApiError } from '../../../models/api-error';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: '../auth.scss',
})
export class RegisterComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z0-9._-]+$/),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected onSubmit(): void {
    if (this.registerForm.invalid || this.isSubmitting()) {
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
      }
      return;
    }
    this.isSubmitting.set(true);
    this.submitError.set(null);

    const userData = this.registerForm.getRawValue();
    this.authApiService
      .register(userData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], {
            queryParams: { registered: true },
          });
        },
        error: (httpError: HttpErrorResponse) => {
          const body: unknown = httpError.error;

          if (!isApiError(body)) {
            this.submitError.set('Failed to register user.');
            return;
          }

          const fieldEntries = Object.entries(body.fieldErrors);

          if (body.code === 'VALIDATION_ERROR' && fieldEntries.length > 0) {
            fieldEntries.forEach(([field, message]) => {
              const control = this.registerForm.get(field);

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
