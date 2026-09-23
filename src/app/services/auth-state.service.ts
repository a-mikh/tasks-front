import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly accessTokenState = signal<string | null>(null);
  readonly accessToken = this.accessTokenState.asReadonly();
  readonly isAuthenticated = computed(() => this.accessTokenState() !== null);

  constructor() {
    this.accessTokenState.set(sessionStorage.getItem('accessToken'));
  }

  saveAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
    this.accessTokenState.set(token);
  }

  clearAccessToken(): void {
    sessionStorage.removeItem('accessToken');
    this.accessTokenState.set(null);
  }
}
