import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutinesComponent } from './routines.component';
import { RouterModule } from '@angular/router';
import { ExercisesModule } from '../../../application/user/modules/exercises/exercises.module';
import {
  ActionConfirmationModalModule
} from '../../../application/user/modules/action-confirmation-modal/action-confirmation-modal.module';



@NgModule({
  declarations: [
    RoutinesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoutinesComponent,
      },
      {
        path: 'create',
        loadChildren: () => import('./create-routine/create-routine.module').then(m => m.CreateRoutineModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./edit-routine/edit-routine.module').then(m => m.EditRoutineModule),
      },
    ]),
    ExercisesModule,
    ActionConfirmationModalModule,
  ],
})
export class RoutinesModule { }
