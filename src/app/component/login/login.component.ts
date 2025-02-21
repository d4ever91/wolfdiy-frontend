import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    // this.loading = true;
    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.loading = false;
        console.log('Navigating to dashboard');
        this.router.navigate(['/dashboard'])
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      }
    );
  }
}
