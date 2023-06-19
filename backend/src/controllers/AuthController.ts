import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/AuthService";
import { User } from "../entity/User";
import { dataSource } from "../app";
import { HttpException, ValidationException } from "../utils/HttpException";

interface RequestWithUser extends Request {
  user: User;
}

export class AuthController {
  private userRepository = dataSource.getRepository(User);

  constructor(private authService: AuthService) {}

  handleValidationErrors(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationException(400, "Validation Error", errors.array());
    }
  }

  async register(req: Request, res: Response) {
    try {
      this.handleValidationErrors(req, res);

      const { username, email, password } = req.body;
      const user = await this.authService.register(username, email, password);
      res.json(user);
    } catch (error) {
      if (error instanceof ValidationException) {
        console.error("Validation Error in register:", error);
        res
          .status(error.status)
          .json({ message: error.message, errors: error.errors });
      } else if (error instanceof HttpException) {
        console.error("Error in register:", error);
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      this.handleValidationErrors(req, res);

      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (error) {
      if (error instanceof ValidationException) {
        console.error("Validation Error in login:", error);
        res
          .status(error.status)
          .json({ message: error.message, errors: error.errors });
      } else if (error instanceof HttpException) {
        console.error("Error in login:", error);
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const token = req.query.token;
      const success = await this.authService.verifyEmail(token as string);

      if (success) {
        res.redirect(`${process.env.FRONT_URL}/login?emailVerified=true`);
        res.json({ message: "Email successfully verified" });
      } else {
        res.status(400).json({ message: "Invalid or expired token" });
      }
    } catch (error) {
      console.error("Error in verifyEmail:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.authService.sendPasswordResetEmail(email);
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await this.authService.updatePassword(token, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      if (error instanceof HttpException) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await this.authService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
}
