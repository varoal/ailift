import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoutineComponent } from './create-routine.component';
import { RouterModule } from '@angular/router';
import { ExercisesModule } from '../../../../application/user/modules/exercises/exercises.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {
  LinearExerciseModalModule
} from '../../../../application/user/modules/linear-exercise-modal/linear-exercise-modal.module';



@NgModule({
  declarations: [
    CreateRoutineComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateRoutineComponent,
      },
    ]),
    ExercisesModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    LinearExerciseModalModule,
  ],
})
export class CreateRoutineModule { }
