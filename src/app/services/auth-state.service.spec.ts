import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should return token in session storage and be authenticated', () => {
    sessionStorage.setItem('accessToken', 'test-token');
    const service = new AuthStateService();

    expect(service.accessToken()).toEqual('test-token');
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should update access token and related state', () => {
    const testToken = 'test-token';
    const service = new AuthStateService();

    service.saveAccessToken(testToken);
    expect(sessionStorage.getItem('accessToken')).toEqual(testToken);
    expect(service.accessToken()).toEqual(testToken);
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should remove access token and update related state', () => {
    const testToken = 'test-token';
    const service = new AuthStateService();

    service.saveAccessToken(testToken);
    expect(sessionStorage.getItem('accessToken')).toEqual(testToken);
    expect(service.accessToken()).toEqual(testToken);
    expect(service.isAuthenticated()).toBeTruthy();

    service.clearAccessToken();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(service.accessToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalsy();
  });
});
