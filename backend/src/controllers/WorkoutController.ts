import { Request, Response } from "express";
import { WorkoutService } from "../services/WorkoutService";
import { Workout } from "../entity/Workout";
import { WorkoutExercise } from "../entity/WorkoutExercise";
import { WorkoutSet } from "../entity/WorkoutSet";

export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  async getActiveWorkout(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const activeWorkout = await this.workoutService.getActiveWorkout(userId);
      res.status(200).json(activeWorkout);
    } catch (error) {
      console.error('Failed to get active workout:', error);
      res.status(500).json({ message: 'An error occurred while retrieving the active workout' });
    }
  }

  async getAllWorkouts(req: Request, res: Response) {
    try {
      const workouts = await this.workoutService.findAll();
      res.json(workouts);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getWorkoutById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const workout = await this.workoutService.findById(id);
      if (!workout)
        return res.status(404).json({ message: "Workout not found" });
      res.json(workout);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getWorkoutsByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const workouts = await this.workoutService.findByUserId(userId);
      if (!workouts)
        return res.status(404).json({ message: "Workouts not found" });
      res.json(workouts);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async startWorkout(req: Request, res: Response) {
    try {
      const { routineId } = req.params;
      const userId = res.locals.user.id;
      const startedWorkout = await this.workoutService.startWorkout(
        routineId,
        userId
      );
      res.json(startedWorkout);
    } catch (error) {
      res.status(500).json({message: (error as Error)?.message??"Error starting workout"});
    }
  }

  async updateWorkout(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedWorkoutData = req.body as Workout;
      const updatedWorkout = await this.workoutService.update(
        id,
        updatedWorkoutData
      );
      if (!updatedWorkout)
        return res.status(404).json({ message: "Workout not found" });
      res.json(updatedWorkout);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteWorkout(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      await this.workoutService.delete(req.params.id, userId);
      res.json({ message: "Workout deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async addExerciseToWorkout(req: Request, res: Response) {
    try {
      const workoutId = req.params.workoutId;
      const newExercise = req.body as WorkoutExercise;
      const addedExercise = await this.workoutService.addExercise(
        workoutId,
        newExercise
      );
      res.json(addedExercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteExerciseFromWorkout(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      await this.workoutService.deleteExercise(exerciseId);
      res.json({ message: "Exercise deleted from workout" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async modifyExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      const exerciseData = req.body as WorkoutExercise;
      const modifiedExercise = await this.workoutService.modifyExercise(
        exerciseId,
        exerciseData
      );
      if (!modifiedExercise)
        return res.status(404).json({ message: "Exercise not found" });
      res.json(modifiedExercise);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async addSetToExercise(req: Request, res: Response) {
    try {
      const workoutExerciseId = req.params.workoutExerciseId;
      const newSetData = req.body;
      const addedSet = await this.workoutService.addSetToWorkoutExercise(
        workoutExerciseId,
        newSetData
      );
      res.json(addedSet);
    } catch (error) {
      if (error === "WorkoutExercise not found") {
        res.status(404).json({ message: "WorkoutExercise not found" });
      } else {
        console.error(error);
        res
          .status(500)
          .json({
            message: "An error occurred while adding the set to the exercise.",
          });
      }
    }
  }

  async modifySet(req: Request, res: Response) {
    try {
      const setId = req.params.setId;
      const setData = req.body as WorkoutSet;
      const modifiedSet = await this.workoutService.modifyWorkoutSet(
        setId,
        setData
      );
      if (!modifiedSet)
        return res.status(404).json({ message: "Set not found" });
      res.json(modifiedSet);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async markSetAsDone(req: Request, res: Response) {
    try {
      const setId = req.params.setId;
      const doneSet = await this.workoutService.markSetAsDone(setId);
      res.json(doneSet);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async markSetAsUndone(req: Request, res: Response) {
    try {
      const setId = req.params.setId;
      const doneSet = await this.workoutService.markSetAsUndone(setId);
      res.json(doneSet);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteSet(req: Request, res: Response) {
    try {
      const setId = req.params.setId;
      await this.workoutService.deleteSet(setId);
      res.json({ message: "Set deleted from exercise" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async finishWorkout(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const finishedWorkout = await this.workoutService.finish(id);
      if (!finishedWorkout)
        return res.status(404).json({ message: "Workout not found" });
      res.json(finishedWorkout);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
