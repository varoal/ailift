// set.controller.ts
import { Request, Response } from "express";
import { SetService } from "../services/SetService";

export class SetController {
  constructor(private setService: SetService) {}

  async getWorkoutSetsByRoutineExerciseId(req: Request, res: Response) {
    const { routineExerciseId } = req.params;
    const sets = await this.setService.findByRoutineExerciseId(routineExerciseId);
    res.json(sets);
  }

  async createSet(req: Request, res: Response): Promise<void> {
    try {
      const { routineExerciseId, reps, weight } = req.body;

    //TODO: Validate input data before passing it to the service

      const set = await this.setService.createSet(routineExerciseId, reps, weight);
      res.status(201).json(set);
    } catch (error) {
      res.status(500).json({error: 'An error occurred while creating the Set.'});
    }
  }

  async updateSet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reps, weight } = req.body;

      //TODO: Validate input data before passing it to the service

      const set = await this.setService.updateSet(id, reps, weight);
      res.json(set);
    } catch (error) {
      res.status(500).json({error: 'An error occurred while updating the Set.'});
    }
  }

  async deleteSet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.setService.deleteSet(id);
      res.json({ message: "Set deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
