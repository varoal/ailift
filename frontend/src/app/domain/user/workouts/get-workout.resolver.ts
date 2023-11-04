import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { GetWorkoutService } from './get-workout.service';
import { Workout } from './workout';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetWorkoutResolver implements Resolve<Workout> {
  constructor(private service: GetWorkoutService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Workout> | Promise<Workout> | Workout {
    return this.service.__invoke(route.paramMap.get('id') as string);
  }
}
