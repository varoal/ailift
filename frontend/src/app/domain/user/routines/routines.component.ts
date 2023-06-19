import { Component, OnInit, ViewChild } from '@angular/core';
import { GetUserRoutinesService } from './get-user-routines.service';
import { Router } from '@angular/router';
import { RemoveRoutineService } from './remove-routine.service';
import { ToastrService } from 'ngx-toastr';
import {
  ActionConfirmationModalComponent,
} from '../../../application/user/modules/action-confirmation-modal/action-confirmation-modal.component';
import { Routine } from '../../../application/user/interfaces/routine';
import { StartWorkoutService } from './start-workout.service';
import { ActiveWorkoutService } from '../../../application/user/services/workouts/active-workout.service';
import { ActiveWorkout } from '../../../application/user/services/workouts/active-workout';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css'],
})
export class RoutinesComponent implements OnInit {

  public routines = [] as Routine[];
  @ViewChild('actionConfirmationModal') public actionConfirmationModal: ActionConfirmationModalComponent = {} as ActionConfirmationModalComponent;
  public activeWorkout: ActiveWorkout = {} as ActiveWorkout;

  constructor(private getUserRoutinesService: GetUserRoutinesService,
              private router: Router,
              private toastr: ToastrService,
              private removeRoutineService: RemoveRoutineService,
              private startWorkoutService: StartWorkoutService,
              private activeWorkoutService: ActiveWorkoutService) {

  }

  public ngOnInit(): void {
    this.getActiveWorkout();
    this.getUserRoutines();
  }

  private getUserRoutines(): void {
    this.getUserRoutinesService.__invoke().subscribe({
      next: (routines) => {
        this.routines = routines;
      },
    });
  }

  public newRoutine(): void {
    this.router.navigate(['/routines/create']);
  }

  public toogleDropdown(i: number): void {
    const dropdown = document.getElementById('dropdown-' + i);
    dropdown?.classList.toggle('hidden');
  }

  public editRoutine(id: string): void {
    this.router.navigate(['/routines/edit/' + id]);
  }

  async removeRoutine(id: string) {
    this.actionConfirmationModal.actionConfirmationData = {
      title: 'Remove routine',
      message: 'Are you sure you want to remove this routine?. This action cannot be undone.',
    };

    this.actionConfirmationModal.openModal();

    this.actionConfirmationModal.actionConfirmedSubject.subscribe({
      next: (actionConfirmed) => {
        if (actionConfirmed) {
          this.removeRoutineConfirmed(id);
        }
      },
    });
  }

  private removeRoutineConfirmed(id: string): void {
    this.removeRoutineService.__invoke(id).subscribe({
      next: () => {
        this.actionConfirmationModal.actionConfirmedSubject.unsubscribe();
        this.toastr.success('Routine removed successfully');
        this.getUserRoutines();
        this.getActiveWorkout();
      }, error: () => {
        this.actionConfirmationModal.actionConfirmedSubject.unsubscribe();
        this.toastr.error('An error occurred while removing the routine');
      },
    });
  }

  public startWorkout(id: string) {
    this.startWorkoutService.__invoke(id).subscribe({
      next: (response) => {
        this.router.navigate(['/workouts/' + response.id]);
      },
    });
  }

  private getActiveWorkout(): void {
    this.activeWorkoutService.__invoke().subscribe({
      next: (response) => {
        this.activeWorkout = response;
      },
    });
  }

  public checkActiveWorkOut(id: string): boolean {
    return this.activeWorkout?.routineId === id;
  }

  public navigateToActiveWorkout(): void {
    this.router.navigate(['/workouts/' + this.activeWorkout.workoutId]);
  }
}
