import { Router } from "express";
import { DataSource } from "typeorm";
import { ExerciseController } from "../controllers/ExerciseController";
import { ExerciseService } from "../services/ExerciseService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import MuscleGroupService from "../services/MuscleGroupService";

export const exerciseRouter = (dataSource: DataSource) => {
  const exerciseRouter = Router();
  const exerciseService = new ExerciseService(dataSource, new MuscleGroupService(dataSource));
  const exerciseController = new ExerciseController(exerciseService);

  exerciseRouter.get("/", exerciseController.getAllExercises.bind(exerciseController));
  exerciseRouter.post("/", authMiddleware, (req, res) => exerciseController.createExercise(req, res));
  // exerciseRouter.get("/:id", exerciseController.getExercise.bind(exerciseController));
  exerciseRouter.put("/:id", authMiddleware, exerciseController.updateExercise.bind(exerciseController));
  exerciseRouter.delete("/:id", authMiddleware, exerciseController.deleteExercise.bind(exerciseController));

  return exerciseRouter;
};
