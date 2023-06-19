import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroupSelectComponent } from './muscle-group-select.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MuscleGroupSelectComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    MuscleGroupSelectComponent,
  ],
})
export class MuscleGroupSelectModule { }
