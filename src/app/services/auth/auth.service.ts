import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Credentials } from 'src/app/modules/credentials.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  private apiUrl = 'https://project.surveywerkx.com/api/v2/admin/auth/login';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<Credentials> {
    // const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'https://project.surveywerkx.com',
    // });
    return this.http.post<{ status: string; message: string; result?: { admin: any; accessToken: string } }>(
      this.apiUrl,
      { email, password },
      // { headers }
    ).pipe(
      map(response => {
        console.log('Login Response:', response); // Debugging log ✅

        if (response.status === 'success' || !response.result?.accessToken) {
          console.warn(' Login failed:', response.message);
          throw new Error(response.message || 'Invalid login credentials');
        }

        // ✅ Only store credentials if login is successful
        const credentials: Credentials = {
          status: response.status,
          message: response.message,
          admin: response.result.admin,
          token: response.result.accessToken,
        };

        localStorage.setItem('credentials', JSON.stringify(credentials));
        this.isAuthenticated.next(true);
        this.router.navigate(['/dashboard']);
        return credentials;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('credentials');
    sessionStorage.removeItem('credentials');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable().pipe(
      map(isAuth => {
        const token = this.getToken();
        console.log('isLoggedIn() =>', { isAuth, token });
        return isAuth && !!token; // Ensure token exists
      })
    );
  }


  getToken(): string | null {
    const credentials = this.getCredentials();
    console.log('getToken() =>', credentials?.token);
    return credentials?.token || null;
  }

  private hasToken(): boolean {
    const token = this.getToken();
    console.log('Checking Token:', token);
    return !!token;
  }

  getCredentials(): Credentials | null {
    const storedData = localStorage.getItem('credentials');
    return storedData ? (JSON.parse(storedData) as Credentials) : null;
  }
}
