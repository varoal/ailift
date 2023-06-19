import { Router, Request, Response } from "express";
import { DataSource } from "typeorm";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  resetPasswordValidationSchema,
} from "../middlewares/AuthValidationMiddleware";

export const authRouter = (dataSource: DataSource) => {
  const authRouter = Router();
  const authService = new AuthService(dataSource);
  const authController = new AuthController(authService);

  authRouter.post(
    "/register",
    registerValidationSchema,
    async (req: Request, res: Response) => {
      try {
        const result = await authController.register(req, res);
        res.json(result);
      } catch (error) {
        console.error("Error in register route:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );

  authRouter.get("/verify", authController.verifyEmail.bind(authController));

  authRouter.post(
    "/login",
    loginValidationSchema,
    (req: Request, res: Response) => authController.login(req, res)
  );

  authRouter.post("/forgot-password", async (req: Request, res: Response) => {
    try {
      const result = await authController.forgotPassword(req, res);
      res.json(result);
    } catch (error) {
      console.error("Error in forgot-password route:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  authRouter.post(
    "/reset-password",
    resetPasswordValidationSchema,
    async (req: Request, res: Response) => {
      try {
        const result = await authController.resetPassword(req, res);
        res.json(result);
      } catch (error) {
        console.error("Error in reset-password route:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );

  authRouter.get("/me", authMiddleware, (req: Request, res: Response) => {
    const user = res.locals.user;
    res.json(user);
  });
  
  authRouter.get(
    "/user/:id",
    authMiddleware,
    authController.getUserById.bind(authController)
  );
  return authRouter;
};
