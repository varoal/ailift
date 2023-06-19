import { DataSource, Repository, UpdateResult } from "typeorm";
import { WorkoutSet } from "../entity/WorkoutSet";
import { WorkoutExercise } from "../entity/WorkoutExercise";

export class WorkoutSetService {
  constructor(
    private dataSource: DataSource,
  ) {}

  private get workoutSetRepository(): Repository<WorkoutSet> {
    return this.dataSource.getRepository(WorkoutSet);
  }

  private async findWorkoutSetOrFail(id: string): Promise<WorkoutSet> {
    const set = await this.workoutSetRepository.findOne({ where: { id } });
    if (!set) {
      throw new Error("WorkoutSet not found");
    }
    return set;
  }

  shouldIncrementWeight(workoutExercise: WorkoutExercise): boolean {
    return (
      workoutExercise.successfulSessionsCount >=
      (workoutExercise.frequencyOfIncrement || 1)
    );
  }

  shouldDeloadWeight(workoutExercise: WorkoutExercise): boolean {
    return (
      workoutExercise.failedSessionsCount >=
      (workoutExercise.frequencyOfDeload || 3)
    );
  }

  findAll(): Promise<WorkoutSet[]> {
    return this.workoutSetRepository.find();
  }

  findByWorkoutExerciseId(workoutExerciseId: string): Promise<WorkoutSet[]> {
    return this.workoutSetRepository.find({
      where: { workoutExercise: { id: workoutExerciseId } },
    });
  }

  findById(id: string): Promise<WorkoutSet | null> {
    return this.workoutSetRepository.findOne({ where: { id } });
  }

  async addWorkoutSet(
    workoutExerciseId: string,
    reps: number,
    weight: number
  ): Promise<WorkoutSet> {
    const workoutExercise = await this.dataSource
      .getRepository(WorkoutExercise)
      .findOne({ where: { id: workoutExerciseId } });

    if (!workoutExercise) {
      throw new Error("WorkoutExercise not found");
    }

    const workoutSet = new WorkoutSet();
    workoutSet.workoutExercise = workoutExercise;
    workoutSet.reps = reps;
    workoutSet.weight = weight;
    workoutSet.isDone = false;

    return await this.workoutSetRepository.save(workoutSet);
  }

  async markWorkoutSetAsDone(id: string): Promise<WorkoutSet> {
    const workoutSet = await this.findWorkoutSetOrFail(id);
    workoutSet.isDone = true;
    return await this.workoutSetRepository.save(workoutSet);
  }

  async updateWorkoutSet(
    id: string,
    reps: number,
    weight: number
  ): Promise<UpdateResult> {
    return await this.workoutSetRepository
      .createQueryBuilder()
      .update(WorkoutSet)
      .set({ reps, weight })
      .where("id = :id", { id })
      .execute();
  }

  async deleteWorkoutSet(id: string): Promise<void> {
    const workoutSet = await this.findWorkoutSetOrFail(id);
    await this.workoutSetRepository.remove(workoutSet);
  }
}

export default WorkoutSetService;
