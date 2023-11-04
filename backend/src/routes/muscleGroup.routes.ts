import { Router } from "express";
import { DataSource } from "typeorm";
import { MuscleGroupController } from "../controllers/MuscleGroupController";
import { MuscleGroupService } from "../services/MuscleGroupService";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const muscleGroupRouter = (dataSource: DataSource) => {
  const muscleGroupRouter = Router();
  const muscleGroupService = new MuscleGroupService(dataSource);
  const muscleGroupController = new MuscleGroupController(muscleGroupService);

  muscleGroupRouter.get(
    "/",
    muscleGroupController.getMuscleGroups.bind(muscleGroupController)
  );
  
  muscleGroupRouter.post("/", authMiddleware, (req, res) =>
    muscleGroupController.createMuscleGroup(req, res)
  );

  return muscleGroupRouter;
};
