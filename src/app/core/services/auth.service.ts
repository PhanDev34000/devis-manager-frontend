import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserProfile } from '../../store/auth/auth.model';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { email, password });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  updateProfile(profile: UserProfile): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/auth/profile`, profile);
  }
}