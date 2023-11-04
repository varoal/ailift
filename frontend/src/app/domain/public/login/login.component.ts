import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface LoginFG {
  email: string | null;
  password: string | null;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loading!: boolean;
  public loginForm: FormGroup = {} as FormGroup;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.activatedRoute.snapshot.queryParams['emailVerified']) {
      this.toastrService.success('Email verified successfully. Please login.');
    }
    this.buildForm();
    this.checkIsLoggedIn();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.__invoke(this.loginForm.value).subscribe({
        next: (loginResponse) => {
          this.loading = false;
          const storage = this.loginForm.value.remember
            ? localStorage
            : sessionStorage;
          storage.setItem('token', loginResponse.token);
          localStorage.setItem('token', loginResponse.token);
          this.router.navigate(['/home']);
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error.message);
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  public checkIsLoggedIn(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public signUp(): void {
    this.router.navigate(['/sign-up']);
  }

  public resetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
