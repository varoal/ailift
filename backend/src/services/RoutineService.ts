import { DataSource, Repository } from "typeorm";
import { Routine } from "../entity/Routine";

export class RoutineService {
  constructor(private dataSource: DataSource) {}

  private get routineRepository(): Repository<Routine> {
    return this.dataSource.getRepository(Routine);
  }

  findAll(): Promise<Routine[]> {
    return this.routineRepository.find({ relations: ["user", "exercises"] });
  }

  findByUserId(userId: string): Promise<Routine[]> {
    return this.routineRepository.find({
      where: { user: { id: userId } },
      relations: ["exercises"],
    });
  }

  findById(id: string): Promise<Routine | null> {
    return this.routineRepository.findOne({
      where: { id },
      relations: ["user", "exercises"],
    });
  }

  async create(inputRoutine: Partial<Routine>): Promise<Routine> {
    const routine = new Routine();
    routine.name = inputRoutine.name!;
    routine.description = inputRoutine.description!;
    routine.user = inputRoutine.user!;

    return await this.routineRepository.save(routine);
  }

  async update(
    id: string,
    inputRoutine: Partial<Routine>
  ): Promise<Routine | null> {
    await this.routineRepository.update(id, inputRoutine);
    return await this.routineRepository.findOne({
      where: { id },
      relations: ["user", "exercises"],
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: ["user", "exercises"],
    });

    if (!routine) {
      throw new Error("Routine not found");
    }

    if (routine.user.id !== userId) {
      throw new Error("User does not have permission to delete this routine");
    }

    await this.routineRepository.delete(id);
  }
}

export default RoutineService;
