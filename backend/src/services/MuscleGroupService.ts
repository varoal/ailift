import { DataSource, Repository } from "typeorm";
import { MuscleGroup } from "../entity/MuscleGroup";

export class MuscleGroupService {
  async findAll(): Promise<MuscleGroup[]> {
    return await this.muscleGroupRepository.find();
  }
  constructor(private dataSource: DataSource) {}

  public get muscleGroupRepository(): Repository<MuscleGroup> {
    return this.dataSource.getRepository(MuscleGroup);
  }

  async createMuscleGroup(name: string): Promise<MuscleGroup> {
    const muscleGroup = new MuscleGroup();
    muscleGroup.name = name;
    return await this.muscleGroupRepository.save(muscleGroup);
  }

  async findMuscleGroupsByName(names: string[]): Promise<MuscleGroup[]> {
    return await this.muscleGroupRepository.find({
      where: names.map((name) => ({ name })),
    });
  }
}

export default MuscleGroupService;
