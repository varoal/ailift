import { DataSource, Repository } from "typeorm";
import { MoreThanOrEqual } from "typeorm";
import { Workout } from "../entity/Workout";

export class UserStatsService {
  constructor(private dataSource: DataSource) {}

  private get workoutRepository(): Repository<Workout> {
    return this.dataSource.getRepository(Workout);
  }

  async getLastWeekWorkouts(userId: string): Promise<Workout[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.workoutRepository.find({
      where: {
        user: { id: userId },
        endedAt: MoreThanOrEqual(oneWeekAgo),
      },
      order: { endedAt: "DESC" },
      relations: ["exercises", "exercises.sets", "exercises.exercise"],
    });
  }

  async getLast14Workouts(userId: string): Promise<Workout[]> {
    return this.workoutRepository.find({
      where: { user: { id: userId } },
      order: { endedAt: "DESC" },
      relations: ["exercises", "exercises.sets", "exercises.exercise"],
      take: 14,
    });
  }

  async getTotalVolumeForWorkout(workoutId: string): Promise<any> {
    const workout = await this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoin("workout.exercises", "exercises")
      .leftJoin("exercises.sets", "sets")
      .select([
        "workout.id AS workoutId",
        "SUM(sets.weight * sets.reps) AS totalVolume",
      ])
      .where("workout.id = :workoutId", { workoutId })
      .andWhere("sets.isDone = :isDone", { isDone: true })
      .groupBy("workout.id")
      .getRawOne();

    return workout;
  }

  async getTotalWeightMovedPerSession(
    userId: string,
    numberOfWorkouts: number
  ): Promise<any> {
    const subQuery = this.workoutRepository
      .createQueryBuilder("workout")
      .select("workout.id")
      .where("workout.userId = :userId", { userId })
      .orderBy("workout.startedAt", "DESC")
      .take(numberOfWorkouts);

    const workouts = await this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoin("workout.exercises", "exercises")
      .leftJoin("exercises.sets", "sets")
      .select([
        "workout.id AS workoutId",
        "SUM(sets.weight * sets.reps) AS totalWeight",
      ])
      .where("workout.id IN (" + subQuery.getQuery() + ")")
      .andWhere("sets.isDone = :isDone", { isDone: true })
      .groupBy("workout.id")
      .setParameters(subQuery.getParameters())
      .getRawMany();

    return workouts;
  }

  async getTotalRepsPerSession(
    userId: string,
    numberOfWorkouts: number
  ): Promise<any> {
    const subQuery = this.workoutRepository
      .createQueryBuilder("workout")
      .select("workout.id")
      .where("workout.userId = :userId", { userId })
      .orderBy("workout.startedAt", "DESC")
      .take(numberOfWorkouts);

    const workouts = await this.workoutRepository
      .createQueryBuilder("workout")
      .leftJoin("workout.exercises", "exercises")
      .leftJoin("exercises.sets", "sets")
      .select(["workout.id AS workoutId", "SUM(sets.reps) AS totalReps"])
      .where("workout.id IN (" + subQuery.getQuery() + ")")
      .andWhere("sets.isDone = :isDone", { isDone: true })
      .groupBy("workout.id")
      .setParameters(subQuery.getParameters())
      .getRawMany();

    return workouts;
  }

  async getMaxWeightForExercisePerSession(
    userId: string,
    exerciseId: string,
    numberOfWorkouts: number
  ): Promise<any> {
    const latestWorkouts = await this.workoutRepository
      .createQueryBuilder("workout")
      .where("workout.userId = :userId", { userId })
      .orderBy("workout.startedAt", "DESC")
      .take(numberOfWorkouts)
      .getMany();

    let results = [];

    for (const workout of latestWorkouts) {
      const maxWeight = await this.workoutRepository
        .createQueryBuilder("workout")
        .leftJoin("workout.exercises", "exercises")
        .leftJoin("exercises.sets", "sets")
        .select([
          "workout.id AS workoutId",
          "workout.userId",
          "exercises.exercise.id AS exerciseId",
          'MAX("sets"."weight") AS "maxWeight"',
        ])
        .where("workout.id = :workoutId", { workoutId: workout.id })
        .andWhere("exercises.exercise.id = :exerciseId", { exerciseId })
        .andWhere("sets.isDone = :isDone", { isDone: true })
        .groupBy("workout.id, exercises.exercise.id")
        .getRawOne();

      if (maxWeight) results.push(maxWeight);
    }

    return results;
  }
}
