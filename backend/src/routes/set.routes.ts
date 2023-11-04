// set.routes.ts
import { Router } from "express";
import { DataSource } from "typeorm";
import { SetController } from "../controllers/SetController";
import { SetService } from "../services/SetService";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const setRouter = (dataSource: DataSource) => {
  const setRouter = Router();
  const setService = new SetService(dataSource);
  const setController = new SetController(setService);

  setRouter.post(
    "/",
    authMiddleware,
    setController.createSet.bind(setController)
  );
  
  setRouter.put(
    "/:id",
    authMiddleware,
    setController.updateSet.bind(setController)
  );

  setRouter.delete(
    "/:id",
    authMiddleware,
    setController.deleteSet.bind(setController)
  );

  return setRouter;
};
