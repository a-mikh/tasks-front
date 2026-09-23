import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/auth/login-response';
import { LoginRequest } from '../models/auth/login-request';
import { RegisterRequest } from '../models/auth/register-request';
import { RegisterResponse } from '../models/auth/register-response';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = '/auth';
  private readonly httpClient = inject(HttpClient);

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, loginData);
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.baseUrl}/register`, registerData);
  }
}
