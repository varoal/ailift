import { Request, Response } from "express";
import { WorkoutExerciseService } from "../services/WorkoutExerciseService";
import { WorkoutExercise } from "../entity/WorkoutExercise";
import { RoutineExercise } from "../entity/RoutineExercise";

export class WorkoutExerciseController {
  constructor(private workoutExerciseService: WorkoutExerciseService) {}

  async getAllWorkoutExercises(req: Request, res: Response) {
    try {
      const workoutExercises = await this.workoutExerciseService.findAll();
      res.json(workoutExercises);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getWorkoutExercisesByWorkoutId(req: Request, res: Response) {
    try {
      const workoutId = req.params.workoutId;
      const workoutExercises =
        await this.workoutExerciseService.findByWorkoutId(workoutId);
      if (!workoutExercises)
        return res.status(404).json({ message: "Workout exercises not found" });
      res.json(workoutExercises);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getWorkoutExerciseById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const workoutExercise = await this.workoutExerciseService.findById(id);
      if (!workoutExercise)
        return res.status(404).json({ message: "Workout exercise not found" });
      res.json(workoutExercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async createWorkoutExercise(req: Request, res: Response) {
    try {
      const newWorkoutExercise = req.body as WorkoutExercise;
      const routineExercise = req.body.routineExercise as RoutineExercise;
      const createdWorkoutExercise = await this.workoutExerciseService.create(
        newWorkoutExercise,
        routineExercise
      );
      res.json(createdWorkoutExercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async addExercise(req: Request, res: Response) {
    try {
      const workoutId = req.params.workoutId;
      const newExercise = req.body as WorkoutExercise;
      const exercise = await this.workoutExerciseService.addExercise(
        workoutId,
        newExercise
      );
      res.json(exercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      await this.workoutExerciseService.deleteExercise(exerciseId);
      res.json({ message: "Exercise deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async modifyExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      const updatedExercise = req.body as WorkoutExercise;
      const exercise = await this.workoutExerciseService.modifyExercise(
        exerciseId,
        updatedExercise
      );
      res.json(exercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async updateWorkoutExercise(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedWorkoutExerciseData = req.body as WorkoutExercise;
      const updatedWorkoutExercise = await this.workoutExerciseService.update(
        id,
        updatedWorkoutExerciseData
      );
      if (!updatedWorkoutExercise)
        return res.status(404).json({ message: "Workout exercise not found" });
      res.json(updatedWorkoutExercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteWorkoutExercise(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.workoutExerciseService.delete(id);
      res.json({ message: "Workout exercise deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
