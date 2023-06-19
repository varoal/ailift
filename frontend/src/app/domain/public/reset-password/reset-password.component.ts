import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { ToastrService } from 'ngx-toastr';

export interface resetPasswordFG {
  email: string | null;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  public resetPasswordForm = {} as FormGroup;
  public loading = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private resetPasswordService: ResetPasswordService,
              private toastrService: ToastrService) {
    this.buildForm();
  }

  public signUp(): void {
    this.router.navigate(['/sign-up']);
  }

  private buildForm(): void {
    this.resetPasswordForm = this.formBuilder.group<resetPasswordFG>({
      email: null,
    });
  }

  public resetPassword(): void {
    this.loading = true;
    this.resetPasswordService.__invoke(this.resetPasswordForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastrService.success('We have sent you an email for reset your password');
        this.router.navigate(['/login']);
      }, error: (errorResponse) => {
        this.loading = false;
        this.toastrService.error('An error occurred while trying to reset your password');
      },
    });
  }
}
