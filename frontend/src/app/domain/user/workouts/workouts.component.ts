import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workout, WorkoutExercise } from './workout';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AddWorkoutSetService } from './add-workout-set.service';
import { MarkWorkoutSetAsDoneService } from './mark-workout-set-as-done.service';
import { MarkWorkoutSetAsUndoneService } from './mark-workout-set-as-undone.service';
import { FinishWorkoutService } from './finish-workout.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateWorkoutExerciseSetService } from './update-workout-exercise-set.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css'],
})
export class WorkoutsComponent implements OnInit, OnDestroy {
  public workout = {} as Workout;
  public workoutForm = {} as FormGroup;
  public timer!: string;
  private intervalTimer!: any;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private addWorkoutSetService: AddWorkoutSetService,
              private markWorkoutSetAsDoneService: MarkWorkoutSetAsDoneService,
              private markWorkoutSetAsUndoneService: MarkWorkoutSetAsUndoneService,
              private finishWorkoutService: FinishWorkoutService,
              private router: Router,
              private toastr: ToastrService,
              private updateWorkoutExerciseSetService: UpdateWorkoutExerciseSetService) {
    this.buildForm();
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalTimer);
  }

  public ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workout }) => {
      this.workout = workout;
      this.initTimer();
      this.fillForm();
    });
  }

  private buildForm() {
    this.workoutForm = this.formBuilder.group({
      exercises: new FormArray([]),
    });
  }

  public getExercisesFormArray(): FormArray<any> {
    return this.workoutForm.get('exercises') as FormArray;
  }

  private fillForm(): void {
    const exercisesForm = this.getExercisesFormArray();
    this.workout.exercises.forEach((exercise) => {
      const exerciseFormControl = this.formBuilder.group({
        id: exercise.id,
        name: exercise.exercise.name,
        progressionType: exercise.progressionType,
        sets: new FormArray([]),
      });
      exercisesForm.push(exerciseFormControl);
      this.fillSetsFormArray(exerciseFormControl, exercise);
    });
  }

  private fillSetsFormArray(exerciseFormControl: any, exercise: WorkoutExercise) {
    const setsForm = exerciseFormControl.get('sets') as FormArray;
    exercise.sets.forEach((set) => {
      const setFormControl = this.formBuilder.group({
        id: set.id,
        reps: set.reps,
        weight: new FormControl({ value: set.weight, disabled: exercise.progressionType === 'linear' }),
        isDone: set.isDone,
      });
      setsForm.push(setFormControl);
      this.checkIfSetIsDone(setFormControl);
    });
  }

  public addSetToExercise(exerciseFormControl: AbstractControl<any>) {
    const setFormControl = this.formBuilder.group({
      id: null,
      routineSetId: null,
      reps: 0,
      weight: 0,
      isDone: false,
    });
    this.createWorkoutSet(setFormControl, exerciseFormControl);
  }

  public getSetsOfExerciseFormArray(exercise: AbstractControl<any>): FormArray<any> {
    return exercise.get('sets') as FormArray;
  }

  private createWorkoutSet(setFormControl: any, exerciseFormControl: any) {
    const sets = exerciseFormControl.get('sets') as FormArray;
    this.addWorkoutSetService.__invoke(exerciseFormControl.value.id, setFormControl.value).subscribe({
      next: (set) => {
        setFormControl.patchValue({ id: set.id });
        sets.push(setFormControl);
        this.checkIfSetIsDone(setFormControl);
      },
    });
  }

  private checkIfSetIsDone(setFormControl: any): void {
    setFormControl.get('isDone').valueChanges.subscribe((isDone: boolean) => {
      if (isDone) {
        this.markWorkoutSetAsDoneService.__invoke(setFormControl.value.id).subscribe({
          next: (set) => {
            setFormControl.patchValue({ routineSetId: set.routineSetId });
          },
        });
      } else {
        this.markWorkoutSetAsUndoneService.__invoke(setFormControl.value.id).subscribe({
          next: () => {
            setFormControl.patchValue({ routineSetId: null });
          },
        });
      }
    });
  }

  public initTimer() {
    this.intervalTimer = setInterval(() => {
      const currentDate = new Date();
      const diff = currentDate.getTime() - new Date(this.workout.startedAt).getTime();

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      this.timer = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  }

  public finishWorkout(): void {
    this.updateWorkoutSets().then(() => {
      this.finishWorkoutService.__invoke(this.workout.id, this.workoutForm.value).subscribe({
        next: () => {
          this.toastr.success('Workout finished!');
          this.router.navigate(['/routines']);
        }, error: () => {
          this.toastr.error('Something went wrong!');
        },
      });
    });
  }

  async updateWorkoutSets() {
    const exercises = this.workoutForm.getRawValue().exercises;
    for (const exercise of exercises) {
      const sets = exercise.sets;
      for (const set of sets) {
        await this.updateWorkoutSet(set);
      }
    }
  }

  private async updateWorkoutSet(set: any) {
    await this.updateWorkoutExerciseSetService.__invoke(set.id, set);
  }

  public navigateBack(): void {
    this.router.navigate(['/routines']);
  }
}
