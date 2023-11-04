import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPasswordComponent } from './new-password.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':token',
        component: NewPasswordComponent,
      },
    ]),
    ReactiveFormsModule,
  ],
})
export class NewPasswordModule {}
