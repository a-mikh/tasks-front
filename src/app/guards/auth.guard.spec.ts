import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { AuthStateService } from '../services/auth-state.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

const authStateServiceMock = {
  isAuthenticated: vi.fn(),
};

const routerMock = {
  createUrlTree: vi.fn(),
};

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateService, useValue: authStateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should return true for authenticated user', () => {
    authStateServiceMock.isAuthenticated.mockReturnValue(true);

    const result = executeGuard();

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect user to login page', () => {
    const loginUrlTree = {} as UrlTree;
    authStateServiceMock.isAuthenticated.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(loginUrlTree);

    const result = executeGuard();

    expect(result).toBe(loginUrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});

function executeGuard() {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}
