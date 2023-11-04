import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SignupService } from './signup.service';
import { ToastrService } from 'ngx-toastr';

export interface SignupFG {
  username: string | null;
  email: string | null;
  description: string | null;
  password: string | null;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  public signUpForm = {} as FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private toastService: ToastrService
  ) {
    this.buildForm();
  }

  public backToLogin(): void {
    this.router.navigate(['/login']);
  }

  private buildForm(): void {
    this.signUpForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]], // Assuming a minimum length for username
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator(),
        ],
      ],
      description: [null],
    });
  }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[!@#$%^&*?.]/.test(value);
      const valid = hasNumber && hasUpper && hasLower && hasSpecial;
      return !valid ? { passwordStrength: true } : null;
    };
  }

  public signup(): void {
    if (this.signUpForm.valid) {
      this.signupService.__invoke(this.signUpForm.value).subscribe({
        next: (signedUpUser) => {
          this.router.navigate(['/login']).then(() => {
            this.toastService.success('User created successfully. Please login.');
            this.toastService.info(
              'Please verify your email.',
              'Verify your email',
              {
                tapToDismiss: true,
              }
            );
          });
        },
        error: (err) => {
          this.toastService.error('An error occurred during signup. Please try again.');
        },
      });
    } else {
      Object.keys(this.signUpForm.controls).forEach(field => {
        const control = this.signUpForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}
