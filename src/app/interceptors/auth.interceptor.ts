import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../services/credentials.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials = this.credentialsService.credentials; // Get credentials object

    if (credentials && credentials.token && !this.credentialsService.isTokenExpired(credentials.token)) { // Check for token existence AND validity
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${credentials.token}`
        }
      });
    }

    return next.handle(req);
  }
}
