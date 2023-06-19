import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  public newPasswordForm = {} as FormGroup;
  private resetToken: string;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastService: ToastrService,
              private newPasswordService: NewPasswordService,
              private activatedRoute: ActivatedRoute) {
    this.resetToken = this.activatedRoute.snapshot.params['token']
    this.buildForm();
  }

  private buildForm() {
    this.newPasswordForm = this.formBuilder.group<NewPasswordFG>({
      newPassword: null,
      token: this.resetToken,
    });
  }

  public newPassword(): void {
    this.newPasswordService.__invoke(this.newPasswordForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']).then(() => {
          this.toastService.success('Password changed successfully. Please login.');
        });
      },
      error: (errorResponse) => {
        this.toastService.error(errorResponse.error.message);
      },
    });
  }
}
