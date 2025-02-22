import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    // this.loading = true;
    this.authService.login(email, password).subscribe(
      response => {
        console.log('Login successful', response);
        this.loading = false;
        console.log('Navigating to dashboard');
        this.router.navigate(['/dashboard'])
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid email or password.'
        this.loading = false;
        // Error alert on login failure
        Swal.fire({
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    );
  }
}
