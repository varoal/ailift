import { DataSource, IsNull, Repository } from "typeorm";
import { Workout } from "../entity/Workout";
import { Routine } from "../entity/Routine";
import { User } from "../entity/User";
import { WorkoutExercise } from "../entity/WorkoutExercise";
import { WorkoutSet } from "../entity/WorkoutSet";
import { RoutineExercise } from "../entity/RoutineExercise";
import { Set } from "../entity/Set";
import { ProgressionType } from "../types/ProgressionType";

export class WorkoutService {
  constructor(private dataSource: DataSource) {}

  private get workoutRepository(): Repository<Workout> {
    return this.dataSource.getRepository(Workout);
  }

  private get workoutExerciseRepository(): Repository<WorkoutExercise> {
    return this.dataSource.getRepository(WorkoutExercise);
  }

  private get workoutSetRepository(): Repository<WorkoutSet> {
    return this.dataSource.getRepository(WorkoutSet);
  }

  private get routineExerciseRepository(): Repository<RoutineExercise> {
    return this.dataSource.getRepository(RoutineExercise);
  }

  private get setRepository(): Repository<Set> {
    return this.dataSource.getRepository(Set);
  }

  async getActiveWorkout(
    userId: string
  ): Promise<{ workoutId: string; routineId: string } | null> {
    const activeWorkout = await this.workoutRepository.findOne({
      where: { user: { id: userId }, endedAt: IsNull() },
      relations: ["routine"],
    });

    if (activeWorkout) {
      return {
        workoutId: activeWorkout.id,
        routineId: activeWorkout.routine.id,
      };
    }

    return null;
  }

  findAll(): Promise<Workout[]> {
    return this.workoutRepository.find({
      relations: ["user", "routine", "exercises", "exercises.sets"],
    });
  }

  findByUserId(userId: string): Promise<Workout[]> {
    return this.workoutRepository.find({
      where: { user: { id: userId } },
      relations: [
        "routine",
        "exercises",
        "exercises.exercise",
        "exercises.sets",
      ],
    });
  }

  findById(id: string): Promise<Workout | null> {
    return this.workoutRepository.findOne({
      where: { id },
      relations: [
        "user",
        "routine",
        "exercises",
        "exercises.exercise",
        "exercises.sets",
      ],
    });
  }

  async startWorkout(routineId: string, userId: string): Promise<Workout> {
    const activeWorkout = await this.workoutRepository.findOne({
      where: { user: { id: userId }, endedAt: IsNull() },
      relations: ["routine"],
    });

    if (activeWorkout) {
      if (activeWorkout.routine.id === routineId) {
        throw new Error(
          "User already has an active workout from a different routine"
        );
      } else {
        throw new Error("User already has an active workout from this routine");
      }
    }

    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId } });
    const routine = await this.dataSource.getRepository(Routine).findOne({
      where: { id: routineId },
      relations: ["exercises", "exercises.exercise", "exercises.sets"],
    });

    if (!user || !routine) {
      throw new Error("User or routine not found");
    }

    const workout = new Workout();
    workout.name = routine.name;
    workout.description = routine.description;
    workout.user = user;
    workout.routine = routine;
    workout.startedAt = new Date();

    const savedWorkout = await this.workoutRepository.save(workout);

    const routineExercises = routine.exercises;

    if (!routineExercises) {
      throw new Error("No exercises in routine");
    }

    for (const routineExercise of routineExercises) {
      const workoutExercise = new WorkoutExercise();
      workoutExercise.workout = savedWorkout;
      workoutExercise.exercise = routineExercise.exercise;
      workoutExercise.routineExercise = routineExercise;
      workoutExercise.progressionType = routineExercise.progressionType;
      workoutExercise.startWeight = routineExercise.startWeight;
      workoutExercise.setsGoal = routineExercise.setsGoal;
      workoutExercise.repsGoal = routineExercise.repsGoal;
      workoutExercise.increments = routineExercise.increments;
      workoutExercise.frequencyOfIncrement =
        routineExercise.frequencyOfIncrement;
      workoutExercise.deload = routineExercise.deload;
      workoutExercise.frequencyOfDeload = routineExercise.frequencyOfDeload;
      workoutExercise.successfulSessionsCount =
        routineExercise.successfulSessionsCount;
      workoutExercise.failedSessionsCount = routineExercise.failedSessionsCount;

      const savedWorkoutExercise = await this.workoutExerciseRepository.save(
        workoutExercise
      );
      routineExercise.sets.sort(
        (a, b) => a.createdDate.getTime() - b.createdDate.getTime()
      );

      for (const set of routineExercise.sets) {
        const workoutSet = new WorkoutSet();
        workoutSet.workoutExercise = savedWorkoutExercise;
        workoutSet.isDone = false;
        workoutSet.reps = set.reps;
        workoutSet.weight = set.weight;
        workoutSet.routineSetId = set.id;

        await this.workoutSetRepository.save(workoutSet);
      }
    }

    return savedWorkout;
  }

  async update(
    id: string,
    inputWorkout: Partial<Workout>
  ): Promise<Workout | null> {
    await this.workoutRepository.update(id, inputWorkout);
    return await this.workoutRepository.findOne({
      where: { id },
      relations: ["user", "routine", "exercises"],
    });
  }

  async modifyExercise(
    exerciseId: string,
    exercise: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise> {
    await this.workoutExerciseRepository.update(exerciseId, exercise);
    const updatedExercise = await this.workoutExerciseRepository.findOne({
      where: { id: exerciseId },
    });

    if (!updatedExercise) {
      throw new Error(`No exercise found with id ${exerciseId}`);
    }

    return updatedExercise;
  }

  async addExercise(
    workoutId: string,
    newExercise: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise> {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new Error("Workout not found");
    }

    const exercise = new WorkoutExercise();
    exercise.workout = workout;
    if (!newExercise.exercise) {
      throw new Error("Exercise not provided");
    }
    exercise.exercise = newExercise.exercise;

    return this.workoutExerciseRepository.save(exercise);
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    const exercise = await this.workoutExerciseRepository.findOne({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    await this.workoutExerciseRepository.delete(exerciseId);
  }

  async modifyWorkoutSet(
    setId: string,
    set: Partial<WorkoutSet>
  ): Promise<WorkoutSet> {
    await this.workoutSetRepository.update(setId, set);
    const updatedSet = await this.workoutSetRepository.findOne({
      where: { id: setId },
    });

    if (!updatedSet) {
      throw new Error(`No set found with id ${setId}`);
    }

    return updatedSet;
  }

  async deleteSet(setId: string): Promise<void> {
    const set = await this.workoutSetRepository.findOne({
      where: { id: setId },
      relations: ["workoutExercise", "workoutExercise.routineExercise"],
    });

    if (!set) {
      throw new Error("Set not found");
    }

    if (set.workoutExercise.routineExercise) {
      const routineSet = await this.setRepository.findOne({
        where: { id: set.routineSetId },
      });

      if (routineSet) {
        await this.setRepository.delete(routineSet.id);
      }
    }

    await this.workoutSetRepository.delete(setId);
  }

  async markSetAsDone(setId: string): Promise<WorkoutSet> {
    let workoutSet = await this.workoutSetRepository.findOne({
      where: { id: setId },
      relations: ["workoutExercise", "workoutExercise.routineExercise"],
    });

    if (!workoutSet) {
      throw new Error(`No set found with id ${setId}`);
    }

    if (!workoutSet.routineSetId) {
      const routineSet = new Set();
      routineSet.routineExercise = workoutSet.workoutExercise.routineExercise;
      routineSet.reps = workoutSet.reps;
      routineSet.weight = workoutSet.weight;

      const savedRoutineSet = await this.setRepository.save(routineSet);

      workoutSet.routineSetId = savedRoutineSet.id;
    }

    workoutSet.isDone = true;

    return await this.workoutSetRepository.save(workoutSet);
  }

  async markSetAsUndone(setId: string): Promise<WorkoutSet> {
    return this.modifyWorkoutSet(setId, { isDone: false });
  }

  async delete(id: string, userId: string): Promise<void> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: ["user", "routine", "exercises"],
    });

    if (!workout) {
      throw new Error("Workout not found");
    }

    if (workout.user.id !== userId) {
      throw new Error("User does not have permission to delete this workout");
    }

    await this.workoutRepository.delete(id);
  }

  async addSetToWorkoutExercise(
    workoutExerciseId: string,
    newSetData: any
  ): Promise<WorkoutSet> {
    const workoutExercise = await this.workoutExerciseRepository.findOne({
      where: { id: workoutExerciseId },
      relations: ["routineExercise"],
    });

    if (!workoutExercise) {
      throw new Error("WorkoutExercise not found");
    }

    const workoutSet = new WorkoutSet();
    workoutSet.workoutExercise = workoutExercise;
    workoutSet.isDone = newSetData.isDone ?? false;
    workoutSet.reps = newSetData.reps ?? 0;
    workoutSet.weight = newSetData.weight ?? 0;
    workoutSet.routineSetId = newSetData.routineSetId;

    const savedWorkoutSet = await this.workoutSetRepository.save(workoutSet);

    return savedWorkoutSet;
  }

  async finish(id: string): Promise<Workout | null> {
    const workout = await this.workoutRepository.findOne({
      where: { id },
      relations: [
        "user",
        "routine",
        "exercises",
        "exercises.sets",
        "exercises.routineExercise",
      ],
    });

    if (!workout) {
      throw new Error("Workout not found");
    }

    workout.endedAt = new Date();
    workout.duration =
      (workout.endedAt.getTime() - workout.startedAt.getTime()) / 60000;

    await this.workoutRepository.save(workout);

    for (const workoutExercise of workout.exercises) {
      try {
        for (const workoutSet of workoutExercise.sets) {
          if (!workoutSet.isDone) {
            continue;
          }

          let routineSet = await this.setRepository.findOne({
            where: { id: workoutSet.routineSetId },
          });

          if (routineSet) {
            routineSet.reps = workoutSet.reps;
            routineSet.weight = workoutSet.weight;
          } else {
            routineSet = new Set();
            routineSet.routineExercise = workoutExercise.routineExercise;
            routineSet.reps = workoutSet.reps;
            routineSet.weight = workoutSet.weight;

            const savedRoutineSet = await this.setRepository.save(routineSet);

            workoutSet.routineSetId = savedRoutineSet.id;
          }

          await this.setRepository.save(routineSet);
          await this.workoutSetRepository.save(workoutSet);
        }

        await this.updateRoutineExercise(workoutExercise);
      } catch (err) {
        console.error(
          `Failed to update RoutineExercise for WorkoutExercise id=${workoutExercise.id}:`,
          err
        );
      }
    }
    return workout;
  }

  async updateRoutineExercise(
    workoutExercise: WorkoutExercise
  ): Promise<RoutineExercise> {
    if (!workoutExercise.routineExercise) {
      throw new Error("WorkoutExercise does not have a routineExercise");
    }
    const routineExercise = await this.routineExerciseRepository.findOne({
      where: { id: workoutExercise.routineExercise.id },
      relations: ["sets"],
    });

    if (!routineExercise) {
      throw new Error("RoutineExercise not found");
    }

    if (routineExercise.progressionType === ProgressionType.LINEAR) {
      return this.updateRoutineExerciseLinear(workoutExercise, routineExercise);
    }

    if (routineExercise.progressionType === ProgressionType.FREE) {
      return this.updateRoutineExerciseFree(workoutExercise, routineExercise);
    }

    return Promise.reject(new Error("Invalid progression type"));
  }

  async updateRoutineExerciseLinear(
    workoutExercise: WorkoutExercise,
    routineExercise: RoutineExercise
  ): Promise<RoutineExercise> {
    const repsGoal = routineExercise.repsGoal || 0;
    const frequencyOfIncrement = routineExercise.frequencyOfIncrement || 0;
    const increments = routineExercise.increments || 0;
    const frequencyOfDeload = routineExercise.frequencyOfDeload || 0;
    const startWeight = routineExercise.startWeight || 0;
    const deload = routineExercise.deload || 0;

    const allSetsDone = workoutExercise.sets.every((set) => set.isDone);
    const allSetsAchievedRepsGoal = workoutExercise.sets.every(
      (set) => set.reps >= repsGoal
    );

    if (allSetsDone && allSetsAchievedRepsGoal) {
      routineExercise.successfulSessionsCount += 1;
      routineExercise.failedSessionsCount = 0;
    } else {
      routineExercise.failedSessionsCount += 1;
      routineExercise.successfulSessionsCount = 0;
    }

    if (routineExercise.successfulSessionsCount >= frequencyOfIncrement) {
      routineExercise.startWeight = startWeight + increments;
      routineExercise.successfulSessionsCount = 0;
      for (const routineSet of routineExercise.sets) {
        routineSet.weight = startWeight + increments;
        await this.setRepository.save(routineSet);
      }
    } else if (routineExercise.failedSessionsCount >= frequencyOfDeload) {
      routineExercise.startWeight = startWeight - deload;
      routineExercise.failedSessionsCount = 0;
      for (const routineSet of routineExercise.sets) {
        routineSet.weight = startWeight - deload;

        await this.setRepository.save(routineSet);
      }
    }
    return this.routineExerciseRepository.save(routineExercise);
  }

  private async updateRoutineExerciseFree(
    workoutExercise: WorkoutExercise,
    routineExercise: RoutineExercise
  ): Promise<RoutineExercise> {
    for (const workoutSet of workoutExercise.sets) {
      if (!workoutSet.isDone) {
        continue;
      }

      let routineSet = await this.setRepository.findOne({
        where: { id: workoutSet.routineSetId },
      });

      if (routineSet) {
        routineSet.reps = workoutSet.reps;
        routineSet.weight = workoutSet.weight;
      } else {
        routineSet = new Set();
        routineSet.routineExercise = routineExercise;
        routineSet.reps = workoutSet.reps;
        routineSet.weight = workoutSet.weight;
      }

      await this.setRepository.save(routineSet);
    }
    return this.routineExerciseRepository.save(routineExercise);
  }
}

export default WorkoutService;
