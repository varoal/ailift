import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Exercise } from '../../../../application/user/modules/exercises/exercise';
import { CreateRoutineService } from './create-routine.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateRoutineExerciseService } from './create-routine-exercise.service';
import { CreateExerciseSetsService } from './create-exercise-sets.service';
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
  reps: number;
  weight: number;
  routineExerciseId: string | null;
}

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.component.html',
  styleUrls: ['./create-routine.component.css'],
})
export class CreateRoutineComponent {
  public routineForm = {} as FormGroup;
  @ViewChild('linearExerciseModal') public linearExerciseModal = {} as LinearExerciseModalComponent;

  constructor(private formBuilder: FormBuilder,
              private createRoutineService: CreateRoutineService,
              private router: Router,
              private toastr: ToastrService,
              private createRoutineExerciseService: CreateRoutineExerciseService,
              private createExerciseSetsService: CreateExerciseSetsService,
              private ngxUiLoaderService: NgxUiLoaderService) {
    this.buildForm();
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
      routineExerciseId: null,
      reps: 0,
      weight: 0,
    });
    sets.push(setFormControl);
  }

  public removeExercise(exercice: AbstractControl<any>): void {
    const exercises = this.getExercisesFormArray();
    const index = exercises.controls.indexOf(exercice);
    exercises.removeAt(index);
  }

  public getSetsOfExerciseFormArray(exercice: AbstractControl<any>): FormArray<any> {
    return exercice.get('sets') as FormArray;
  }

  public removeSet(exercise: AbstractControl<any>, set: AbstractControl<any>): void {
    const sets = this.getSetsOfExerciseFormArray(exercise);
    const index = sets.controls.indexOf(set);
    sets.removeAt(index);
  }

  async createRoutine() {
    this.ngxUiLoaderService.startLoader('create-routine');
    const routine = await this.createRoutineService.__invoke(this.routineForm.getRawValue());
    await this.createRoutineExercises(routine!.id);
    this.routineCreated();
  }

  private async createRoutineExercises(routineId: string) {
    const exercises = this.getExercisesFormArray();
    for (const exercise of exercises.getRawValue()) {
      exercise.routineId = routineId;
      const exerciseResponse = await this.createRoutineExerciseService.__invoke(exercise);
      await this.createExerciseSets(exerciseResponse, exercise);
    }
  }

  private routineCreated() {
    setTimeout(() => {
      this.ngxUiLoaderService.stopLoader('create-routine');
      this.toastr.success('Routine created successfully');
      this.router.navigate(['/routines']);
    }, 1500);
  }

  private async createExerciseSets(exerciseResponse: any, exercise: any) {
    for (const set of exercise.sets) {
      console.log(set);
      set.routineExerciseId = exerciseResponse.id;
      await this.createExerciseSetsService.__invoke(set);
    }
  }

  private addLinearProgressionSets(exerciseFormControl: any): void {
    const sets = exerciseFormControl.get('sets') as FormArray;
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
