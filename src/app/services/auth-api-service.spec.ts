import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';
import { RegisterResponse } from './../models/auth/register-response';
import { RegisterRequest } from '../models/auth/register-request';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('register', () => {
    it('should register a user', () => {
      const requestDto: RegisterRequest = {
        username: 'test-username',
        password: 'test-password',
      };
      const responseDto: RegisterResponse = {
        id: 1,
        username: 'test-username',
      };

      service.register(requestDto).subscribe((response) => {
        expect(response).toEqual(responseDto);
      });

      const request = httpTestingController.expectOne(
        (request) => request.url === '/auth/register',
      );

      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(requestDto);

      request.flush(responseDto);
    });
  });
});
