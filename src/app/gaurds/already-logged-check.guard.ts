import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CredentialsService } from '../services/credentials.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const alreadyLoggedCheckGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const credentialsService = inject(CredentialsService);
  const router = inject(Router);

  return credentialsService.credentials$.pipe(
    map(credentials => {
      const isAuthenticated = !!credentials?.token && !credentialsService['isTokenExpired'](credentials.token);

      if (isAuthenticated) {
        router.navigateByUrl('/dashboard');
        return false; // Prevent access to login page
      } else {
        return true; // Allow access to login page
      }
    })
  );
};
