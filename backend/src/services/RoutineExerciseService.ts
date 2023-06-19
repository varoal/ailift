import { DataSource, Repository } from "typeorm";
import { Routine } from "../entity/Routine";
import { Exercise } from "../entity/Exercise";
import { RoutineExercise } from "../entity/RoutineExercise";
import { Set } from "../entity/Set";
import { SetService } from "./SetService";
import { ProgressionType } from "../types/ProgressionType";

export class RoutineExerciseService {
  constructor(private dataSource: DataSource, private setService: SetService) {}

  private get routineExerciseRepository(): Repository<RoutineExercise> {
    return this.dataSource.getRepository(RoutineExercise);
  }

  private get routineRepository(): Repository<Routine> {
    return this.dataSource.getRepository(Routine);
  }

  private get exerciseRepository(): Repository<Exercise> {
    return this.dataSource.getRepository(Exercise);
  }

  async findAll(): Promise<RoutineExercise[]> {
    return await this.routineExerciseRepository.find({
      relations: ["routine", "exercise", "sets"],
      select: ["id", "routine", "exercise", "progressionType"],
    });
  }

  findByRoutineId(routineId: string): Promise<RoutineExercise[]> {
    return this.routineExerciseRepository.find({
      where: { routine: { id: routineId } },
      relations: ["routine", "exercise", "sets"],
      select: [
        "id",
        "routine",
        "exercise",
        "progressionType",
        "setsGoal",
        "repsGoal",
        "frequencyOfIncrement",
        "frequencyOfDeload",
        "startWeight",
        "increments",
        "deload",
      ],
    });
  }

  async findById(id: string): Promise<RoutineExercise | null> {
    return await this.routineExerciseRepository.findOne({
      where: { id },
      relations: ["routine", "exercise", "sets"],
      select: [
        "id",
        "routine",
        "exercise",
        "progressionType",
        "setsGoal",
        "repsGoal",
        "frequencyOfIncrement",
        "frequencyOfDeload",
        "startWeight",
        "increments",
        "deload",
      ],
    });
  }

  async createRoutineExercise(
    routineId: string,
    exerciseId: string,
    progressionType: ProgressionType,
    startWeight: number,
    frequencyOfIncrement: number,
    increments: number,
    frequencyOfDeload: number,
    deload: number,
    setsGoal: number,
    repsGoal: number
  ) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
    });
    const exercise = await this.exerciseRepository.findOne({
      where: { id: exerciseId },
    });

    if (!routine) {
      throw new Error("Routine not found");
    }

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    const routineExercise = new RoutineExercise();
    routineExercise.routine = routine;
    routineExercise.exercise = exercise;

    routineExercise.progressionType = progressionType;

    if (progressionType === ProgressionType.LINEAR) {
      routineExercise.startWeight = startWeight;
      routineExercise.frequencyOfIncrement = frequencyOfIncrement;
      routineExercise.increments = increments;
      routineExercise.frequencyOfDeload = frequencyOfDeload;
      routineExercise.deload = deload;
      routineExercise.setsGoal = setsGoal;
      routineExercise.repsGoal = repsGoal;
    }

    const createdRoutineExercise = await this.routineExerciseRepository.save(
      routineExercise
    );
    // if (progressionType === ProgressionType.LINEAR) {
    //   for (let i = 0; i < setsGoal; i++) {
    //     await this.setService.createSet(
    //       createdRoutineExercise.id,
    //       repsGoal,
    //       startWeight
    //     );
    //   }
    // }

    const { sets: _, ...routineExerciseWithoutSets } = createdRoutineExercise;
    return routineExerciseWithoutSets;
  }

  async updateRoutineExercise(
    id: string,
    routineId: string | null,
    exerciseId: string | null,
    progressionType: ProgressionType,
    startWeight: number | null,
    frequencyOfIncrement: number | null,
    increments: number | null,
    frequencyOfDeload: number | null,
    deload: number | null,
    setsGoal: number | null,
    repsGoal: number | null
  ): Promise<RoutineExercise> {
    const routineExercise = await this.routineExerciseRepository.findOne({
      where: { id },
    });

    if (!routineExercise) {
      throw new Error("RoutineExercise not found");
    }

    if (routineId) {
      const routine = await this.routineRepository.findOne({
        where: { id: routineId },
      });
      if (!routine) {
        throw new Error("Routine not found");
      }
      routineExercise.routine = routine;
    }

    if (exerciseId) {
      const exercise = await this.exerciseRepository.findOne({
        where: { id: exerciseId },
      });
      if (!exercise) {
        throw new Error("Exercise not found");
      }
      routineExercise.exercise = exercise;
    }

    if (progressionType) {
      routineExercise.progressionType = progressionType;

      if (progressionType === ProgressionType.LINEAR) {
        if (startWeight !== null) {
          routineExercise.startWeight = startWeight;
        }

        if (frequencyOfIncrement !== null) {
          routineExercise.frequencyOfIncrement = frequencyOfIncrement;
        }

        if (increments !== null) {
          routineExercise.increments = increments;
        }

        if (frequencyOfDeload !== null) {
          routineExercise.frequencyOfDeload = frequencyOfDeload;
        }

        if (deload !== null) {
          routineExercise.deload = deload;
        }

        if (setsGoal !== null) {
          routineExercise.setsGoal = setsGoal;
        }

        if (repsGoal !== null) {
          routineExercise.repsGoal = repsGoal;
        }
      }
    }

    const updatedRoutineExercise = await this.routineExerciseRepository.save(
      routineExercise
    );

    return updatedRoutineExercise;
  }

  async deleteRoutineExercise(id: string) {
    const routineExercise = await this.routineExerciseRepository.findOne({
      where: { id },
      relations: ["sets"],
    });

    if (!routineExercise) {
      throw new Error("RoutineExercise not found");
    }

    await Promise.all(
      routineExercise.sets.map((set) =>
        this.dataSource.getRepository(Set).remove(set)
      )
    );

    await this.routineExerciseRepository.remove(routineExercise);
  }

  async incrementWeight(routineExerciseId: string): Promise<RoutineExercise> {
    const routineExercise = await this.routineExerciseRepository.findOne({
      where: { id: routineExerciseId },
    });

    if (!routineExercise) {
      throw new Error("RoutineExercise not found");
    }

    if (routineExercise.progressionType === ProgressionType.LINEAR) {
      if (
        routineExercise.frequencyOfIncrement &&
        routineExercise.increments &&
        routineExercise.sets.length % routineExercise.frequencyOfIncrement === 0
      ) {
        routineExercise.startWeight =
          (routineExercise.startWeight || 0) + routineExercise.increments;
      }

      if (
        routineExercise.frequencyOfDeload &&
        routineExercise.deload &&
        routineExercise.sets.length % routineExercise.frequencyOfDeload === 0
      ) {
        routineExercise.startWeight =
          (routineExercise.startWeight || 0) - routineExercise.deload;
      }
    }

    return await this.routineExerciseRepository.save(routineExercise);
  }

  async addSetToRoutineExercise(
    routineExerciseId: string,
    reps: number,
    weight: number
  ): Promise<Set> {
    const set = await this.setService.createSet(
      routineExerciseId,
      reps,
      weight
    );
    await this.incrementWeight(routineExerciseId);
    return set;
  }
}

export default RoutineExerciseService;
