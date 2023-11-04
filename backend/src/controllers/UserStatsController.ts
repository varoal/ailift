import { Request, Response } from "express";
import { UserStatsService } from "../services/UserStatsService";

export class UserStatsController {
  constructor(private userStateService: UserStatsService) {}

  async getLastWeekWorkouts(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const workouts = await this.userStateService.getLastWeekWorkouts(userId);
      res.json(workouts);
    } catch (err) {
      res.status(500).json({ message: err as Error });
    }
  }

  async getLast14Workouts(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const workouts = await this.userStateService.getLast14Workouts(userId);
      res.json(workouts);
    } catch (err) {
      res.status(500).json({ message: err as Error });
    }
  }

  async getTotalVolumeForWorkout(req: Request, res: Response) {
    const workoutId = req.params.workoutId;
    try {
      const volume = await this.userStateService.getTotalVolumeForWorkout(
        workoutId
      );
      res.json(volume);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async getTotalWeightMovedPerSession(req: Request, res: Response) {
    const userId = req.params.userId;
    const numberOfWorkouts = parseInt(req.params.numberOfWorkouts, 10);
    try {
      const weights = await this.userStateService.getTotalWeightMovedPerSession(
        userId,
        numberOfWorkouts
      );
      res.json(weights);
    } catch (err) {
      res.status(500).json({ message: err as Error });
    }
  }

  async getTotalRepsPerSession(req: Request, res: Response) {
    const userId = req.params.userId;
    const numberOfWorkouts = parseInt(req.params.numberOfWorkouts, 10);
    try {
      const reps = await this.userStateService.getTotalRepsPerSession(
        userId,
        numberOfWorkouts
      );
      res.json(reps);
    } catch (err) {
      res.status(500).json({ message: err as Error });
    }
  }
  async getMaxWeightForExercisePerSession(req: Request, res: Response) {
    const userId = req.params.userId;
    const exerciseId = req.params.exerciseId;
    const numberOfWorkouts = parseInt(req.params.numberOfWorkouts, 10);
    try {
      const maxWeights =
        await this.userStateService.getMaxWeightForExercisePerSession(
          userId,
          exerciseId,
          numberOfWorkouts
        );
      res.json(maxWeights);
    } catch (err) {
      res.status(500).json({ message: err as Error });
    }
  }
}
