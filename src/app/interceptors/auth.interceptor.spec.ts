import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthStateService } from '../services/auth-state.service';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

const authStateServiceMock = {
  accessToken: vi.fn(),
  clearAccessToken: vi.fn(),
};

const routerMock = {
  navigate: vi.fn(),
};

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStateService, useValue: authStateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add bearer token to task requests', () => {
    authStateServiceMock.accessToken.mockReturnValue('test-token');

    httpClient.get('/tasks').subscribe();

    const request = httpTestingController.expectOne('/tasks');

    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');

    request.flush({});
  });

  it('should not add authorization header when token is missing', () => {
    authStateServiceMock.accessToken.mockReturnValue(null);

    httpClient.get('/tasks').subscribe();

    const request = httpTestingController.expectOne('/tasks');

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush({});
  });

  it('should clear token and redirect to login after unauthorized response', () => {
    authStateServiceMock.accessToken.mockReturnValue('expired-token');
    const errorHandler = vi.fn();

    httpClient.get('/tasks').subscribe({
      error: errorHandler,
    });

    const request = httpTestingController.expectOne('/tasks');

    request.flush(
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(authStateServiceMock.clearAccessToken).toHaveBeenCalledOnce();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { reason: 'session-expired' },
      replaceUrl: true,
    });
    expect(errorHandler).toHaveBeenCalledOnce();
  });
});
