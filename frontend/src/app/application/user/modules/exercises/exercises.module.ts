import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExercisesComponent } from './exercises.component';
import { MuscleGroupSelectModule } from '../muscle-group-select/muscle-group-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ExercisesComponent],
  imports: [
    CommonModule,
    MuscleGroupSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ExercisesComponent]
})
export class ExercisesModule { }
