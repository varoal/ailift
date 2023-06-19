import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinearExerciseModalComponent } from './linear-exercise-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LinearExerciseModalComponent,
  ],
  exports: [
    LinearExerciseModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class LinearExerciseModalModule { }
