import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../services/auth-api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { isApiError } from '../../../models/api-error';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: '../auth.scss',
})
export class LoginComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStateService = inject(AuthStateService);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/\S/)]],
    password: ['', [Validators.required, Validators.pattern(/\S/)]],
  });
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly registrationSucceeded = signal(
    this.activatedRoute.snapshot.queryParamMap.get('registered') === 'true',
  );
  protected readonly sessionExpired = signal(
    this.activatedRoute.snapshot.queryParamMap.get('reason') === 'session-expired',
  );

  protected onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
      }
      return;
    }
    this.registrationSucceeded.set(false);
    this.sessionExpired.set(false);
    this.isSubmitting.set(true);
    this.submitError.set(null);

    const userData = this.loginForm.getRawValue();
    this.authApiService
      .login(userData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.authStateService.saveAccessToken(response.accessToken);
          this.router.navigate(['/']);
        },
        error: (httpError: HttpErrorResponse) => {
          const body: unknown = httpError.error;

          if (!isApiError(body)) {
            this.submitError.set('Failed to login user.');
            return;
          }

          const fieldEntries = Object.entries(body.fieldErrors);

          if (body.code === 'VALIDATION_ERROR' && fieldEntries.length > 0) {
            fieldEntries.forEach(([field, message]) => {
              const control = this.loginForm.get(field);

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
