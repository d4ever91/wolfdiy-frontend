import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialsService } from '../services/credentials.service'; // Import CredentialsService
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private credentialsService: CredentialsService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.credentialsService.credentials$.pipe(
      take(1),
      map(credentials => {
        const isAuthenticated = !!credentials?.token && !this.credentialsService['isTokenExpired'](credentials.token);
        if (isAuthenticated) {
          return true; // Allow access
        } else {
          // Not authenticated, redirect to login page
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
