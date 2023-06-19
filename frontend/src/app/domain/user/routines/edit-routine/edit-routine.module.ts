import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoutineComponent } from './edit-routine.component';
import { RouterModule } from '@angular/router';
import { ExercisesModule } from '../../../../application/user/modules/exercises/exercises.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {
  LinearExerciseModalModule
} from '../../../../application/user/modules/linear-exercise-modal/linear-exercise-modal.module';


@NgModule({
  declarations: [
    EditRoutineComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditRoutineComponent,
      },
    ]),
    ExercisesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    LinearExerciseModalModule,
  ],
})
export class EditRoutineModule {
}
