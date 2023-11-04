import { Request, Response } from "express";
import { WorkoutSetService } from "../services/WorkoutSetService";

export class WorkoutSetController {
  constructor(private workoutSetService: WorkoutSetService) {}

  async getWorkoutSetsByWorkoutExerciseId(req: Request, res: Response) {
    const { workoutExerciseId } = req.params;
    const sets = await this.workoutSetService.findByWorkoutExerciseId(
      workoutExerciseId
    );
    res.json(sets);
  }

  async getAllWorkoutSets(_req: Request, res: Response) {
    const workoutSets = await this.workoutSetService.findAll();
    res.json(workoutSets);
  }

  async getWorkoutSetById(req: Request, res: Response) {
    const { id } = req.params;
    const workoutSet = await this.workoutSetService.findById(id);
    res.json(workoutSet);
  }

  async addWorkoutSet(req: Request, res: Response): Promise<void> {
    try {
      const { workoutExerciseId, reps, weight } = req.body;
      const set = await this.workoutSetService.addWorkoutSet(
        workoutExerciseId,
        reps,
        weight
      );
      res.status(201).json(set);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async updateWorkoutSet(req: Request, res: Response): Promise<void> {
    const id = req.params.setId;
    const { reps, weight } = req.body;
    console.log(req.params);
    console.log(req.body);
    try {
      const updatedWorkoutSet = await this.workoutSetService.updateWorkoutSet(
        id,
        reps,
        weight
      );
      res.json(updatedWorkoutSet);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteWorkoutSet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.workoutSetService.deleteWorkoutSet(id);
      res.json({ message: "Set deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
