// user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { DataSource } from "typeorm";
import { updateUserValidationSchema } from "../middlewares/UserValidationMiddleware";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const userRouter = (dataSource: DataSource) => {
  const userRouter = Router();
  const userService = new UserService(dataSource);
  const userController = new UserController(userService);

  userRouter.get("/:id", userController.getUserProfile.bind(userController));
  userRouter.put("/:id", authMiddleware, updateUserValidationSchema, userController.updateUserProfile.bind(userController));

  return userRouter;
};
