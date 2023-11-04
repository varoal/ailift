import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedLayoutComponent } from './infrastructure/layout/logged-layout/logged-layout.component';
import { authGuard } from './infrastructure/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: LoggedLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./domain/user/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'routines',
    component: LoggedLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./domain/user/routines/routines.module').then(
        (m) => m.RoutinesModule
      ),
  },
  {
    path: 'exercises',
    component: LoggedLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./domain/user/exercises-list/exercises-list.module').then(
        (m) => m.ExercisesListModule
      ),
  },
  {
    path: 'workouts',
    component: LoggedLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./domain/user/workouts/workouts.module').then(
        (m) => m.WorkoutsModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
