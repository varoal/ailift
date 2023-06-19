import { Router } from "express";
import { DataSource } from "typeorm";
import { WorkoutController } from "../controllers/WorkoutController";
import { WorkoutSetController } from "../controllers/WorkoutSetController";
import { WorkoutService } from "../services/WorkoutService";
import { WorkoutExerciseService } from "../services/WorkoutExerciseService";
import { WorkoutSetService } from "../services/WorkoutSetService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import RoutineExerciseService from "../services/RoutineExerciseService";

export const workoutRouter = (dataSource: DataSource) => {
  const workoutRouter = Router();
  const workoutSetService = new WorkoutSetService(dataSource);
  const workoutService = new WorkoutService(dataSource);
  
  const workoutController = new WorkoutController(workoutService);
  const workoutSetController = new WorkoutSetController(workoutSetService);

  workoutRouter.post("/start/:routineId", authMiddleware, workoutController.startWorkout.bind(workoutController));
  workoutRouter.get("/active", authMiddleware, workoutController.getActiveWorkout.bind(workoutController));
  workoutRouter.get("/:id", workoutController.getWorkoutById.bind(workoutController));
  workoutRouter.get("/user/:userId", workoutController.getWorkoutsByUserId.bind(workoutController));
  workoutRouter.get("/", workoutController.getAllWorkouts.bind(workoutController));

  workoutRouter.put("/:id", authMiddleware, workoutController.updateWorkout.bind(workoutController));
  workoutRouter.delete("/:id", authMiddleware, workoutController.deleteWorkout.bind(workoutController));
  workoutRouter.post("/finish/:id", authMiddleware, workoutController.finishWorkout.bind(workoutController));
  workoutRouter.post("/sets/done/:setId", authMiddleware, workoutController.markSetAsDone.bind(workoutController));
  workoutRouter.post("/sets/undone/:setId", authMiddleware, workoutController.markSetAsUndone.bind(workoutController));
  workoutRouter.post("/sets/add/:workoutExerciseId", authMiddleware, workoutController.addSetToExercise.bind(workoutController));
  workoutRouter.delete("/sets/:setId", authMiddleware, workoutController.deleteSet.bind(workoutController));  
 
  workoutRouter.put("/sets/:setId", authMiddleware, workoutSetController.updateWorkoutSet.bind(workoutSetController));
 
  return workoutRouter;
};