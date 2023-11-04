import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsComponent } from './workouts.component';
import { RouterModule } from '@angular/router';
import { GetWorkoutResolver } from './get-workout.resolver';
import { ExercisesModule } from '../../../application/user/modules/exercises/exercises.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [WorkoutsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: WorkoutsComponent,
        resolve: { workout: GetWorkoutResolver },
      },
    ]),
    ExercisesModule,
    FormsModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
  ],
})
export class WorkoutsModule {}
