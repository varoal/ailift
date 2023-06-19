// routineExercise.controller.ts
import { Request, Response } from "express";
import { RoutineExerciseService } from "../services/RoutineExerciseService";
import { classToPlain } from "class-transformer";

export class RoutineExerciseController {
  constructor(private routineExerciseService: RoutineExerciseService) {}

  async getAllRoutineExercises(req: Request, res: Response): Promise<void> {
    const routineExercise = await this.routineExerciseService.findAll();
    res.json(routineExercise);
  }

  async getRoutineExercisesByRoutineId(
    req: Request,
    res: Response
  ): Promise<void> {
    const routineId = req.params.routineId;
    const routineExercises = await this.routineExerciseService.findByRoutineId(
      routineId
    );
    if (!routineExercises || routineExercises.length === 0) {
      res
        .status(404)
        .json({ error: "No RoutineExercises found for this routine" });
      return;
    }

    res.json(routineExercises);
  }

  async getRoutineExerciseById(req: Request, res: Response): Promise<void> {
    const routineExercise = await this.routineExerciseService.findById(
      req.params.id
    );
    if (!routineExercise) {
      res.status(404).json({ error: "RoutineExercise not found" });
      return;
    }

    const sanitizedRoutineExercise = JSON.parse(
      JSON.stringify(routineExercise)
    );
    res.json(sanitizedRoutineExercise);
  }

  async createRoutineExercise(req: Request, res: Response) {
    try {
      const { routineId, exerciseId, progressionType, startWeight, frequencyOfIncrement, increments, frequencyOfDeload, deload, setsGoal, repsGoal } = req.body;

      const routineExercise = await this.routineExerciseService.createRoutineExercise(
        routineId,
        exerciseId,
        progressionType,
        startWeight,
        frequencyOfIncrement,
        increments,
        frequencyOfDeload,
        deload,
        setsGoal,
        repsGoal
      );
      res.status(201).json(routineExercise);
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'An error occurred while creating the RoutineExercise.'});
    }
}

async updateRoutineExercise(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { routineId, exerciseId, progressionType, startWeight, frequencyOfIncrement, increments, frequencyOfDeload, deload, setsGoal, repsGoal } = req.body;

      const routineExercise = await this.routineExerciseService.updateRoutineExercise(
        id,
        routineId,
        exerciseId,
        progressionType,
        startWeight,
        frequencyOfIncrement,
        increments,
        frequencyOfDeload,
        deload,
        setsGoal,
        repsGoal
      );
      res.json(routineExercise);
    } catch (error) {
      res.status(500).json({error: 'An error occurred while updating the RoutineExercise.'});
    }
}


  async deleteRoutineExercise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.routineExerciseService.deleteRoutineExercise(id);
      res.json({ message: "RoutineExercise deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async incrementWeight(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedRoutineExercise = await this.routineExerciseService.incrementWeight(id);
      res.json(updatedRoutineExercise);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while incrementing the weight.' });
    }
  }

  async addSetToRoutineExercise(req: Request, res: Response): Promise<void> {
    try {
      const { routineExerciseId } = req.params;
      const { reps, weight } = req.body;
      const updatedRoutineExercise = await this.routineExerciseService.addSetToRoutineExercise(routineExerciseId, reps, weight);
      res.json(updatedRoutineExercise);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding a set to the RoutineExercise.' });
    }
  }
}
