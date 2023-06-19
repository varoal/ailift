import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SignedupUser } from './signedup-user';
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

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private signupService: SignupService,
              private toastService: ToastrService) {
    this.buildForm();
  }

  public backToLogin(): void {
    this.router.navigate(['/login']);
  }

  private buildForm(): void {
    this.signUpForm = this.formBuilder.group<SignupFG>({
      description: null,
      email: null,
      password: null,
      username: null,
    });
  }

  public signup(): void {
    this.signupService.__invoke(this.signUpForm.value).subscribe({
      next: (signedUpUser) => {
        this.router.navigate(['/login']).then(() => {
          this.toastService.success('User created successfully. Please login.');
          this.toastService.info('Please verify your email.', 'Verify your email', {
            tapToDismiss: true,
          });
        });
      }
    })
  }
}
