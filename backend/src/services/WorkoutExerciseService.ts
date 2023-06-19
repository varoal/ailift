import { DataSource, Repository } from "typeorm";
import { WorkoutExercise } from "../entity/WorkoutExercise";
import { RoutineExercise } from "../entity/RoutineExercise";
import RoutineExerciseService from "./RoutineExerciseService";

export class WorkoutExerciseService {
  constructor(
    private dataSource: DataSource,
    private routineExerciseService: RoutineExerciseService
  ) {}

  private get workoutExerciseRepository(): Repository<WorkoutExercise> {
    return this.dataSource.getRepository(WorkoutExercise);
  }

  findAll(): Promise<WorkoutExercise[]> {
    return this.workoutExerciseRepository.find({
      relations: ["workout", "exercise", "sets"],
      select: ["id", "workout", "exercise", "progressionType"],
    });
  }

  findByWorkoutId(workoutId: string): Promise<WorkoutExercise[]> {
    return this.workoutExerciseRepository.find({
      where: { workout: { id: workoutId } },
      relations: ["workout", "exercise", "sets"],
      select: ["id", "workout", "exercise", "progressionType"],
    });
  }

  findById(id: string): Promise<WorkoutExercise | null> {
    return this.workoutExerciseRepository.findOne({
      where: { id },
      relations: ["workout", "exercise", "sets"],
      select: ["id", "workout", "exercise", "progressionType"],
    });
  }

  async create(
    inputWorkoutExercise: Partial<WorkoutExercise>,
    routineExercise: RoutineExercise
  ): Promise<WorkoutExercise> {
    const workoutExercise = new WorkoutExercise();
    workoutExercise.exercise = inputWorkoutExercise.exercise!;
    workoutExercise.workout = inputWorkoutExercise.workout!;

    workoutExercise.progressionType = routineExercise.progressionType;
    workoutExercise.startWeight = routineExercise.startWeight;
    workoutExercise.setsGoal = routineExercise.setsGoal;
    workoutExercise.repsGoal = routineExercise.repsGoal;
    workoutExercise.increments = routineExercise.increments;
    workoutExercise.frequencyOfIncrement = routineExercise.frequencyOfIncrement;
    workoutExercise.deload = routineExercise.deload;
    workoutExercise.frequencyOfDeload = routineExercise.frequencyOfDeload;

    // Add successful and failed sessions count from routineExercise
    workoutExercise.successfulSessionsCount =
      routineExercise.successfulSessionsCount;
    workoutExercise.failedSessionsCount = routineExercise.failedSessionsCount;

    return await this.workoutExerciseRepository.save(workoutExercise);
  }

  async update(
    id: string,
    inputWorkoutExercise: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise | null> {
    await this.workoutExerciseRepository.update(id, inputWorkoutExercise);
    return await this.workoutExerciseRepository.findOne({
      where: { id },
      relations: ["workout", "exercise", "sets"],
    });
  }

  async delete(id: string): Promise<void> {
    await this.workoutExerciseRepository.delete(id);
  }

  async addExercise(
    workoutId: string,
    newExercise: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise> {
    const workoutExercise = new WorkoutExercise();
    workoutExercise.workout = newExercise.workout!;
    workoutExercise.exercise = newExercise.exercise!;

    await this.workoutExerciseRepository.save(workoutExercise);

    return workoutExercise;
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    await this.workoutExerciseRepository.delete(exerciseId);
  }

  async modifyExercise(
    exerciseId: string,
    updatedExercise: Partial<WorkoutExercise>
  ): Promise<WorkoutExercise | null> {
    await this.workoutExerciseRepository.update(exerciseId, updatedExercise);
    const updatedWorkoutExercise = await this.workoutExerciseRepository.findOne(
      { where: { id: exerciseId } }
    );

    if (!updatedWorkoutExercise) {
      throw new Error("Exercise not found");
    }

    return updatedWorkoutExercise;
  }
}

export default WorkoutExerciseService;
