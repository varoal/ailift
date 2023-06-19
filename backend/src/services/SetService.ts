import { DataSource, Repository } from "typeorm";
import { Set } from "../entity/Set";
import { RoutineExercise } from "../entity/RoutineExercise";

export class SetService {
  constructor(private dataSource: DataSource) {}

  findAll(): Promise<Set[]> {
    return this.setRepository.find();
  }

  findByRoutineExerciseId(routineExerciseId: string): Promise<Set[]> {
    return this.setRepository.find({
      where: { routineExercise: { id: routineExerciseId } },
    });
  }

  private get setRepository(): Repository<Set> {
    return this.dataSource.getRepository(Set);
  }

  async createSet(
    routineExerciseId: string,
    reps: number,
    weight: number | null = null
  ): Promise<Set> {
    const routineExercise = await this.dataSource
      .getRepository(RoutineExercise)
      .findOne({ where: { id: routineExerciseId } });

    if (!routineExercise) {
      throw new Error("RoutineExercise not found");
    }

    const set = new Set();
    set.routineExercise = routineExercise;
    set.reps = reps;
    set.weight = weight !== null ? weight : routineExercise.startWeight || 0;

    return await this.setRepository.save(set);
  }

  async updateSet(id: string, reps: number, weight: number): Promise<Set> {
    const set = await this.setRepository.findOne({ where: { id } });

    if (!set) {
      throw new Error("Set not found");
    }

    set.reps = reps;
    set.weight = weight;

    return await this.setRepository.save(set);
  }

  async deleteSet(id: string): Promise<void> {
    const set = await this.setRepository.findOne({ where: { id } });

    if (!set) {
      throw new Error("Set not found");
    }

    await this.setRepository.remove(set);
  }
}

export default SetService;
