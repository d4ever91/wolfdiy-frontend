import { Injectable } from '@angular/core';
import { Credentials } from '../modules/credentials.interface';
import { BehaviorSubject } from 'rxjs';
// import * as jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
const credentialsKey = 'credentials';

@Injectable({
  providedIn: 'root'
})

export class CredentialsService {
  private _credentials = new BehaviorSubject<Credentials | null>(null);
  public credentials$ = this._credentials.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor() {
    this.loadCredentialsFromStorage();
  }

  private loadCredentialsFromStorage(): void {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);

    if (savedCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);

        if (
          typeof parsedCredentials === 'object' &&
          parsedCredentials !== null &&
          'token' in parsedCredentials
        ) {
          if (!this.isTokenExpired(parsedCredentials.token)) {
            this._credentials.next(parsedCredentials as Credentials);
          } else {
            console.warn('Token expired, clearing credentials');
            this.setCredentials(null); // Clear credentials
          }
        } else {
          console.warn('Invalid credentials format in storage.');
          this.setCredentials(null); // Clear potentially corrupted credentials
        }
      } catch (error) {
        console.error('Error parsing credentials from storage:', error);
        this.setCredentials(null); // Clear potentially corrupted credentials
      }
    }
  }

  get credentials(): Credentials | null {
    return this._credentials.value;
  }

  // isAuthenticated(): boolean {
  //   return !!this._credentials.value?.token && !this.isTokenExpired(this._credentials.value.token);
  // }

  setCredentials(credentials: Credentials | null | undefined = undefined, remember = true): void {
    this._credentials.next(credentials || null);
    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

   isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}

