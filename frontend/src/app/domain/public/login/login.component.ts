import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
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
    });
  }

  public login(): void {
    this.loginService.__invoke(this.loginForm.value).subscribe({
      next: (loginResponse) => {
        localStorage.setItem('token', loginResponse.token);
        this.router.navigate(['/home']);
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error.message);
      },
    });
  }

  public checkIsLoggedIn(): void {
    if (localStorage.getItem('token')) {
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
