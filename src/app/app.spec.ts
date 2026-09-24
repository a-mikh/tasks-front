import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter, Router } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';

describe('App', () => {
  let authStateService: AuthStateService;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    authStateService = TestBed.inject(AuthStateService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render application brand link', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const brand = compiled.querySelector('.app-brand');

    expect(brand?.textContent).toContain('Task Manager');
    expect(brand?.getAttribute('href')).toBe('/');
  });

  it('should log out a user', () => {
    const testToken = 'test-token';
    authStateService.saveAccessToken(testToken);

    const clearTokenSpy = vi.spyOn(authStateService, 'clearAccessToken');
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const logoutButton = nativeElement.querySelector('#logout_button') as HTMLButtonElement;
    logoutButton.click();
    fixture.detectChanges();

    expect(clearTokenSpy).toHaveBeenCalledOnce();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(authStateService.accessToken()).toBeNull();
  });
});
