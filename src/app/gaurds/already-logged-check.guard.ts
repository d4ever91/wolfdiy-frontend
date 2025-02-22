import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CredentialsService } from '../services/credentials.service';

export const alreadyLoggedCheckGuard: CanActivateFn = (route, state) => {
  const credentialsService = inject(CredentialsService);
  const router = inject(Router);

  if (credentialsService.credentials?.token) {
    router.navigateByUrl('/dashboard');
    return false;
  }
  return true;
};
