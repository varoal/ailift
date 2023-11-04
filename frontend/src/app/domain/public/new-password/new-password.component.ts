import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NewPasswordService } from './new-password.service';

export interface NewPasswordFG {
  newPassword: string | null;
  token: string | null;
}

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent {
  public loading: boolean = false;
  public newPasswordForm = {} as FormGroup;
  private resetToken: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private newPasswordService: NewPasswordService,
    private activatedRoute: ActivatedRoute
  ) {
    this.resetToken = this.activatedRoute.snapshot.params['token'];
    this.buildForm();
  }

  private buildForm() {
    this.newPasswordForm = this.formBuilder.group({
      newPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator(),
        ],
      ],
      token: this.resetToken,
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
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const valid = hasNumber && hasUpper && hasLower && hasSpecial;
      return !valid ? { passwordStrength: true } : null;
    };
  }

  public newPassword(): void {
    if (this.newPasswordForm.valid) {
      this.loading = true;
      this.newPasswordService.__invoke(this.newPasswordForm.value).subscribe({
        next: () => {
          this.loading = false;

          this.router.navigate(['/login']).then(() => {
            this.toastService.success(
              'Password changed successfully. Please login.'
            );
          });
        },
        error: (errorResponse) => {
          this.loading = false;
          this.toastService.error(errorResponse.error.message);
        },
      });
    } else {
      this.newPasswordForm.markAllAsTouched();
    }
  }
}
