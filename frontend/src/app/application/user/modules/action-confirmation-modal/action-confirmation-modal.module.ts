import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionConfirmationModalComponent } from './action-confirmation-modal.component';



@NgModule({
  declarations: [
    ActionConfirmationModalComponent,
  ],
  exports: [
    ActionConfirmationModalComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class ActionConfirmationModalModule { }
