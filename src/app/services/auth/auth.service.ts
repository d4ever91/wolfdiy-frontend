import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { Credentials } from 'src/app/modules/credentials.interface';
import { CredentialsService } from '../credentials.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://project.surveywerkx.com/api/v2/admin/auth/login';

  constructor(private http: HttpClient, private router: Router, private credentialsService: CredentialsService) { }

  login(email: string, password: string): Observable<Credentials> {
    return this.http.post<{ status: string; message: string; result?: { admin: any; accessToken: string } }>(
      this.apiUrl,
      { email, password }
    ).pipe(
      map((response: { status: string; message: string; result?: { admin: any; accessToken: string } }) => {
        if (response.status !== 'Success' || !response.result?.accessToken) {
          console.warn('Login failed:', response.message);
          throw new Error(response.message || 'Invalid login credentials');
        }

        const credentials: Credentials = {
          status: response.status,
          message: response.message,
          admin: response.result.admin,
          token: response.result.accessToken,
        };

        return credentials;
      }),
      tap(credentials => {
        this.credentialsService.setCredentials(credentials);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    this.credentialsService.setCredentials(null);
    this.router.navigate(['/login']);
  }
}
