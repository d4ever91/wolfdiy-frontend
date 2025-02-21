import { Injectable } from '@angular/core';
import { Credentials } from '../modules/credentials.interface';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

const credentialsKey = 'credentials';

@Injectable({
  providedIn: 'root'
})

export class CredentialsService {
  private _credentials = new BehaviorSubject<Credentials | null>(null);
  public credentials$ = this._credentials.asObservable();

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

  isAuthenticated(): boolean {
    return !!this._credentials.value?.token && !this.isTokenExpired(this._credentials.value.token);
  }

  setCredentials(credentials: Credentials | null | undefined = undefined, remember = true): void {
    this._credentials.next(credentials || null); // Update the BehaviorSubject

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwt_decode.jwtDecode(token); // Decode the token
      if (!decodedToken || !decodedToken.exp) {
        return true; // Token is invalid or doesn't have an expiry
      }

      const expiryDate = new Date(decodedToken.exp * 1000); // Convert seconds to milliseconds
      return expiryDate <= new Date(); // Check if expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if there's an error decoding
    }
  }
}

