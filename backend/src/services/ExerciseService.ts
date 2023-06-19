import { DataSource, In, Repository } from "typeorm";
import { Exercise } from "../entity/Exercise";
import { MuscleGroupService } from "../services/MuscleGroupService";
import { InputExercise } from "../controllers/ExerciseController";

export class ExerciseService {
  constructor(
    private dataSource: DataSource,
    private muscleGroupService: MuscleGroupService
  ) {}

  private get exerciseRepository(): Repository<Exercise> {
    return this.dataSource.getRepository(Exercise);
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exerciseRepository.find({
      relations: ["primaryMuscleGroup", "secondaryMuscleGroups"],
    });
  }

  async findById(id: string): Promise<Exercise | null> {
    return await this.exerciseRepository.findOne({ where: { id } });
  }

  async create({
    name,
    description,
    primaryMuscleGroupId,
    secondaryMuscleGroupId,
  }: InputExercise): Promise<Exercise> {
    const primaryMuscleGroup =
      await this.muscleGroupService.muscleGroupRepository.findOne({
        where: { id: primaryMuscleGroupId },
      });
    if (!primaryMuscleGroup) {
      throw new Error("Primary muscle group not found");
    }

    const secondaryMuscleGroups =
      await this.muscleGroupService.muscleGroupRepository.find({
        where: { id: In(secondaryMuscleGroupId) },
      });

    const exercise = new Exercise();
    exercise.name = name;
    exercise.description = description;
    exercise.primaryMuscleGroup = primaryMuscleGroup;
    exercise.secondaryMuscleGroups = secondaryMuscleGroups;

    return await this.exerciseRepository.save(exercise);
  }

  async update(id: string, exercise: Exercise): Promise<Exercise | null> {
    await this.exerciseRepository.update(id, exercise);
    return await this.exerciseRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.exerciseRepository.delete(id);
  }
}

export default ExerciseService;
