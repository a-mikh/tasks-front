import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authStateService.isAuthenticated;

  protected onLogout(): void {
    this.authStateService.clearAccessToken();
    void this.router.navigate(['/login']);
  }
}
