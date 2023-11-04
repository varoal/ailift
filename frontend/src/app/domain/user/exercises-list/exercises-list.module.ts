import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExercisesListComponent } from './exercises-list.component';
import { RouterModule } from '@angular/router';
import { ExercisesModule } from '../../../application/user/modules/exercises/exercises.module';

@NgModule({
  declarations: [ExercisesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExercisesListComponent,
      },
    ]),
    ExercisesModule,
  ],
})
export class ExercisesListModule {}
