import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateRoutineExerciseService } from '../create-routine/create-routine-exercise.service';
import { CreateExerciseSetsService } from '../create-routine/create-exercise-sets.service';
import { Exercise } from '../../../../application/user/modules/exercises/exercise';
import { GetRoutineService } from './get-routine.service';
import { Routine } from '../../../../application/user/interfaces/routine';
import { GetRoutineExerciseService } from './get-routine-exercise.service';
import { EditRoutineService } from './edit-routine.service';
import { EditRoutineExerciseSetService } from './edit-routine-exercise-set.service';
import { DeleteRoutineExerciseService } from './delete-routine-exercise.service';
import { DeleteRoutineExerciseSetService } from './delete-routine-exercise-set.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  LinearExerciseModalComponent,
} from '../../../../application/user/modules/linear-exercise-modal/linear-exercise-modal.component';

interface RoutineFG {
  name: string;
  description: string;
  exercises: FormArray<never>;
}

interface ExerciseFG {
  id: string | null;
  routineId: string | null;
  exerciseId: string | null;
  name: string;
  sets: FormArray<never>;
  progressionType: string;
  repsGoal: number | null;
  setsGoal: number | null;
  startWeight: number | null;
  frequencyOfIncrement: number | null;
  increments: number | null;
  deload: number | null;
  frequencyOfDeload: number | null;
  successfulSessionsCount: number | null;
  failedSessionsCount: number | null;
  isEditable: boolean;
}

interface SetFG {
  id: string | null;
  reps: number;
  weight: number;
  routineExerciseId: string | null;
}

@Component({
  selector: 'app-edit-routine',
  templateUrl: './edit-routine.component.html',
  styleUrls: ['./edit-routine.component.css'],
})
export class EditRoutineComponent implements OnInit {
  public routineForm = {} as FormGroup;
  private readonly routineId: string;
  private routine = {} as Routine;
  private exercisesForBeingDeleted: string[] = [];
  private exerciseSetsForBeingDeleted: string[] = [];
  @ViewChild('linearExerciseModal') public linearExerciseModal = {} as LinearExerciseModalComponent;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private createRoutineExerciseService: CreateRoutineExerciseService,
              private createExerciseSetsService: CreateExerciseSetsService,
              private activatedRoute: ActivatedRoute,
              private getRoutineService: GetRoutineService,
              private getRoutineExerciseService: GetRoutineExerciseService,
              private editRoutineService: EditRoutineService,
              private editRoutineExerciseSetService: EditRoutineExerciseSetService,
              private deleteRoutineExerciseService: DeleteRoutineExerciseService,
              private deleteRoutineExerciseSetService: DeleteRoutineExerciseSetService,
              private ngxUiLoaderService: NgxUiLoaderService) {
    this.routineId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.buildForm();
  }

  public ngOnInit(): void {
    this.getRoutine();
  }

  private buildForm() {
    this.routineForm = this.formBuilder.group<RoutineFG>({
      name: '',
      description: '',
      exercises: new FormArray([]),
    });
  }

  public addExerciseToRoutine($event: Exercise): void {
    const exercises = this.getExercisesFormArray();
    if (!this.checkIfExerciseIsInRoutine($event)) {
      const exerciseFormControl = this.formBuilder.group<ExerciseFG>({
        id: null,
        deload: null,
        failedSessionsCount: null,
        frequencyOfDeload: null,
        frequencyOfIncrement: null,
        increments: null,
        progressionType: 'free',
        repsGoal: null,
        setsGoal: null,
        startWeight: null,
        successfulSessionsCount: null,
        exerciseId: $event.id,
        routineId: null,
        name: $event.name,
        isEditable: false,
        sets: new FormArray([]),
      });

      exercises.push(exerciseFormControl);

      exerciseFormControl.get('progressionType')?.valueChanges.subscribe((value) => {
        if (value === 'linear') {
          this.openLinearProgressionModal(exerciseFormControl);
        } else {
          exerciseFormControl.patchValue({ isEditable: false });
        }
      });

      if (exerciseFormControl.get('progressionType')?.value === 'free') {
        this.addSetToExercise(exerciseFormControl);
      }
    }
  }

  public openLinearProgressionModal(exerciseFormControl: any) {
    this.linearExerciseModal.setLinearProgressionData(exerciseFormControl.value);
    this.linearExerciseModal.openModal();
    exerciseFormControl.patchValue({ isEditable: true });
    this.linearExerciseModal.actionConfirmedSubject.subscribe((data) => {
      exerciseFormControl.patchValue({
        progressionType: 'linear',
        repsGoal: data.repsGoal,
        setsGoal: data.setsGoal,
        startWeight: data.startWeight,
        frequencyOfIncrement: data.frequencyOfIncrement,
        increments: data.increments,
        deload: data.deload,
        frequencyOfDeload: data.frequencyOfDeload,
      }, { emitEvent: false });
      this.addLinearProgressionSets(exerciseFormControl);
    });
  }

  public checkIfExerciseIsInRoutine($event: Exercise): boolean {
    const exercises = this.getExercisesFormArray();
    return exercises.value.some((exercise: ExerciseFG) => exercise.exerciseId === $event.id);
  }

  public getExercisesFormArray(): FormArray<any> {
    return this.routineForm.get('exercises') as FormArray;
  }

  public addSetToExercise(exerciseFormControl: AbstractControl<any>) {
    const sets = exerciseFormControl.get('sets') as FormArray;
    const setFormControl = this.formBuilder.group<SetFG>({
      id: null,
      routineExerciseId: null,
      reps: 0,
      weight: 0,
    });
    sets.push(setFormControl);
  }

  public removeExercise(exercise: AbstractControl<any>): void {
    const exercises = this.getExercisesFormArray();
    const index = exercises.controls.indexOf(exercise);
    const exerciseId = exercise.get('id')?.value;
    if (exerciseId) {
      this.exercisesForBeingDeleted.push(exerciseId);
    }
    exercises.removeAt(index);
  }

  public getSetsOfExerciseFormArray(exercice: AbstractControl<any>): FormArray<any> {
    return exercice.get('sets') as FormArray;
  }

  public removeSet(exercise: AbstractControl<any>, set: AbstractControl<any>): void {
    const sets = this.getSetsOfExerciseFormArray(exercise);
    const index = sets.controls.indexOf(set);
    const setId = set.get('id')?.value;
    if (setId) {
      this.exerciseSetsForBeingDeleted.push(setId);
    }
    sets.removeAt(index);
  }

  public editRoutine(): void {
    this.ngxUiLoaderService.startLoader('update-routine');

    this.deleteItemsFromRoutine();
    this.editRoutineService.__invoke(this.routineForm.value, this.routineId).subscribe({
      next: (routine) => {
        setTimeout(() => {
          this.ngxUiLoaderService.stopLoader('update-routine');
          this.toastr.success('Routine edited successfully');
          this.router.navigate(['/routines']);
        }, 3000);
        const exercises = this.getExercisesFormArray();
        exercises.controls.forEach((exercise: AbstractControl<any>) => {
          this.createOrEditExercise(exercise);
        });
      }, error: () => {
        this.toastr.error('Error updating routine');
      },
    });
  }

  private getRoutine(): void {
    this.getRoutineService.__invoke(this.routineId).subscribe({
      next: (routine) => {
        this.routine = routine;
        this.routineForm.patchValue({
          name: routine.name,
          description: routine.description,
        });
        this.getRoutineExercises();
      },
    });
  }

  private getRoutineExercises(): void {
    const exercises = this.getExercisesFormArray();
    this.getRoutineExerciseService.__invoke(this.routineId).subscribe({
      next: (routineExercises) => {
        routineExercises.forEach((routineExercise) => {
          const exerciseFormControl = this.formBuilder.group<ExerciseFG>({
            deload: routineExercise.deload,
            failedSessionsCount: routineExercise.failedSessionsCount,
            frequencyOfDeload: routineExercise.frequencyOfDeload,
            frequencyOfIncrement: routineExercise.frequencyOfIncrement,
            increments: routineExercise.increments,
            isEditable: routineExercise.progressionType === 'linear',
            progressionType: routineExercise.progressionType,
            repsGoal: routineExercise.repsGoal,
            setsGoal: routineExercise.setsGoal,
            startWeight: routineExercise.startWeight,
            successfulSessionsCount: routineExercise.successfulSessionsCount,
            id: routineExercise.id,
            exerciseId: routineExercise.exercise.id,
            routineId: this.routineId,
            name: routineExercise.exercise.name,
            sets: new FormArray([]),
          });
          exercises.push(exerciseFormControl);

          exerciseFormControl.get('progressionType')?.valueChanges.subscribe((value) => {
            if (value === 'linear') {
              this.openLinearProgressionModal(exerciseFormControl);
              exercises.get('sets')?.disable();
            } else {
              exerciseFormControl.patchValue({ isEditable: false });
              exerciseFormControl.get('sets')?.enable();
            }
          });

          routineExercise.sets.forEach((set: any) => {
            const setFormControl = this.formBuilder.group<any>({
              id: set.id,
              routineExerciseId: routineExercise.id,
              reps: new FormControl({
                value: set.reps,
                disabled: exerciseFormControl.get('progressionType')?.value === 'linear',
              }),
              weight: new FormControl({
                value: set.weight,
                disabled: exerciseFormControl.get('progressionType')?.value === 'linear',
              }),
            });
            const sets = exerciseFormControl.get('sets') as FormArray;
            sets.push(setFormControl);
          });
        });
      },
    });
  }

  private createOrEditExercise(exercise: any) {
    if (!exercise.value.id) {
      this.createExercise(exercise);
    } else {
      exercise.getRawValue().sets.forEach((set: SetFG) => {
        this.createOrEditSets(set, exercise.value.id);
      });
    }
  }

  private createExercise(exercise: any) {
    exercise.routineId = this.routineId;
    this.createRoutineExerciseService.__invoke(exercise.value).then((exerciseResponse) => {
      exercise.getRawValue().sets.forEach((set: SetFG) => {
        this.createOrEditSets(set, exerciseResponse!.id);
      });
    });
  }

  async createOrEditSets(set: any, exerciseId: string) {
    if (!set.id) {
      set.routineExerciseId = exerciseId;
      await this.createExerciseSetsService.__invoke(set);
    } else {
      this.editRoutineExerciseSetService.__invoke(set, set.id).subscribe({
        next: () => {
        },
      });
    }
  }

  private deleteItemsFromRoutine() {
    this.exerciseSetsForBeingDeleted.forEach((setId) => {
      this.deleteSet(setId);
    });

    this.exercisesForBeingDeleted.forEach((exerciseId) => {
      this.deleteExercise(exerciseId);
    });
  }

  private deleteExercise(exerciseId: string) {
    this.deleteRoutineExerciseService.__invoke(exerciseId).subscribe({
      next: () => {
      },
    });
  }

  private deleteSet(setId: string) {
    this.deleteRoutineExerciseSetService.__invoke(setId).subscribe({
      next: () => {
      },
    });
  }

  private addLinearProgressionSets(exerciseFormControl: any): void {
    const sets = exerciseFormControl.get('sets') as FormArray;
    sets.controls.forEach((set: AbstractControl<any>) => {
      this.exerciseSetsForBeingDeleted.push(set.get('id')?.value);
    });
    sets.clear();
    const setsGoal = exerciseFormControl.get('setsGoal')?.value;
    const repsGoal = exerciseFormControl.get('repsGoal')?.value;
    const startWeight = exerciseFormControl.get('startWeight')?.value;
    const increment = exerciseFormControl.get('increments')?.value;
    for (let i = 0; i < setsGoal; i++) {
      const setFormControl = this.formBuilder.group({
        routineExerciseId: new FormControl({ value: null, disabled: true }),
        reps: new FormControl({ value: repsGoal, disabled: true }),
        weight: new FormControl({ value: startWeight, disabled: true }),
      });
      sets.push(setFormControl);
    }
  }

  public navigateBack() {
    this.router.navigate(['/routines']);
  }
}
