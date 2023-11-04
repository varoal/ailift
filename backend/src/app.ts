import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { MuscleGroup } from "./entity/MuscleGroup";
import { Exercise } from "./entity/Exercise";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { exerciseRouter } from "./routes/exercise.routes";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import { muscleGroupRouter } from "./routes/muscleGroup.routes";
import { RoutineExercise } from "./entity/RoutineExercise";
import { Routine } from "./entity/Routine";
import { routineRouter } from "./routes/routine.routes";
import { UserExercise } from "./entity/UserExercise";
import { Workout } from "./entity/Workout";
import { WorkoutExercise } from "./entity/WorkoutExercise";
import { Set } from "./entity/Set";
import { routineExerciseRouter } from "./routes/routineExercise.routes";
import { Token } from "./entity/Token";
import { ValidationException } from "./utils/HttpException";
import { WorkoutSet } from "./entity/WorkoutSet";
import { setRouter } from "./routes/set.routes";
import { workoutRouter } from "./routes/workout.routes";
import { userStatsRouter } from "./routes/userStats.routes";
import { seedDatabase } from "./seeding/seedDatabase";

dotenv.config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.get("/", (req, res) => {
  res.send("AILift API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  logger: "advanced-console",
  logging: false,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    User,
    Exercise,
    MuscleGroup,
    Routine,
    RoutineExercise,
    UserExercise,
    Workout,
    WorkoutExercise,
    Set,
    WorkoutSet,
    Token,
  ],
  synchronize: true,
});
dataSource
  .initialize()
  .then(async () => {
    console.log("Connected to the database");
    if (process.env.NODE_ENV !== "production") {
      await seedDatabase();
    }

    app.use("/api/auth", authRouter(dataSource));
    app.use("/api/user", authMiddleware, userRouter(dataSource));
    app.use("/api/exercises", exerciseRouter(dataSource));
    app.use("/api/musclegroups", muscleGroupRouter(dataSource));
    app.use("/api/routines", routineRouter(dataSource));
    app.use("/api/routine-exercises", routineExerciseRouter(dataSource));
    app.use("/api/sets", setRouter(dataSource));
    app.use("/api/workouts", workoutRouter(dataSource));
    app.use("/api/userstats", userStatsRouter(dataSource));

    app.get("/protected", authMiddleware, (req, res) => {
      res.json({ message: "Protected route" });
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ValidationException) {
        return res.status(err.status).json(err.errors);
      }
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
  })
  .catch((error) => console.log("Error connecting to the database:", error));
