import { dataSource } from "../app";
import { Exercise } from "../entity/Exercise";
import { MuscleGroup } from "../entity/MuscleGroup";

export async function seedDatabase() {
  const muscleGroupRepository = dataSource.getRepository(MuscleGroup);
  const exerciseRepository = dataSource.getRepository(Exercise);

  let chest: MuscleGroup;
  let back: MuscleGroup;
  let shoulders: MuscleGroup;
  let legs: MuscleGroup;
  let arms: MuscleGroup;
  let abs: MuscleGroup;

  const muscleGroupCount = await muscleGroupRepository.count();
  if (muscleGroupCount === 0) {
    console.log("Seeding muscle groups...");

    [chest, back, shoulders, legs, arms, abs] =
      await muscleGroupRepository.save([
        { name: "Chest" },
        { name: "Back" },
        { name: "Shoulders" },
        { name: "Legs" },
        { name: "Arms" },
        { name: "Abs" },
      ]);
  } else {
    chest = await muscleGroupRepository.findOneBy({ name: "Chest" });
    back = await muscleGroupRepository.findOneBy({ name: "Back" });
    shoulders = await muscleGroupRepository.findOneBy({ name: "Shoulders" });
    legs = await muscleGroupRepository.findOneBy({ name: "Legs" });
    arms = await muscleGroupRepository.findOneBy({ name: "Arms" });
    abs = await muscleGroupRepository.findOneBy({ name: "Abs" });
  }

  const exerciseCount = await exerciseRepository.count();
  if (exerciseCount === 0) {
    console.log("Seeding exercises...");
    await exerciseRepository.save([
      {
        name: "Bench Press",
        description: "Horizontal Push",
        primaryMuscleGroup: chest,
      },
      {
        name: "Squat",
        description: "Quad Dominant Leg Exercise",
        primaryMuscleGroup: legs,
      },
      {
        name: "Deadlift",
        description: "Hip Dominant Leg Exercise",
        primaryMuscleGroup: back,
      },
      {
        name: "Overhead Press",
        description: "Vertical Push",
        primaryMuscleGroup: shoulders,
      },
      {
        name: "Barbell Curl",
        description: "Bicep Isolation Exercise",
        primaryMuscleGroup: arms,
      },
      {
        name: "Tricep Pushdown",
        description: "Tricep Isolation Exercise",
        primaryMuscleGroup: arms,
      },
      {
        name: "Pull Up",
        description: "Vertical Pull",
        primaryMuscleGroup: back,
      },
      {
        name: "Push Up",
        description: "Horizontal Push",
        primaryMuscleGroup: chest,
      },
      {
        name: "Plank",
        description: "Core Isometric Exercise",
        primaryMuscleGroup: abs,
      },
      {
        name: "Leg Press",
        description: "Leg Press Machine Exercise",
        primaryMuscleGroup: legs,
      },
      {
        name: "Bent Over Row",
        description: "Horizontal Pull",
        primaryMuscleGroup: back,
      },
      {
        name: "Lateral Raise",
        description: "Shoulder Isolation Exercise",
        primaryMuscleGroup: shoulders,
      },
      {
        name: "Leg Extension",
        description: "Quad Isolation Exercise",
        primaryMuscleGroup: legs,
      },
      {
        name: "Hamstring Curl",
        description: "Hamstring Isolation Exercise",
        primaryMuscleGroup: legs,
      },
      {
        name: "Crunches",
        description: "Abdominal Flexion Exercise",
        primaryMuscleGroup: abs,
      },
      {
        name: "Dips",
        description: "Tricep and Chest Exercise",
        primaryMuscleGroup: chest,
      },
      {
        name: "Calf Raise",
        description: "Calf Isolation Exercise",
        primaryMuscleGroup: legs,
      },
      {
        name: "Skull Crushers",
        description: "Tricep Isolation Exercise",
        primaryMuscleGroup: arms,
      },
      {
        name: "Face Pull",
        description: "Rear Delt and Upper Back Exercise",
        primaryMuscleGroup: shoulders,
      },
      {
        name: "Lat Pulldown",
        description: "Vertical Pull for Lats",
        primaryMuscleGroup: back,
      },
      {
        name: "Russian Twist",
        description: "Oblique and Core Exercise",
        primaryMuscleGroup: abs,
      },
      {
        name: "Farmers Walk",
        description: "Grip, Forearm, and Core Exercise",
        primaryMuscleGroup: arms,
      },
      {
        name: "Seated Row",
        description: "Horizontal Pull for Back",
        primaryMuscleGroup: back,
      },
      {
        name: "Chest Fly",
        description: "Chest Isolation Exercise",
        primaryMuscleGroup: chest,
      },
      {
        name: "Reverse Fly",
        description: "Rear Delt Isolation Exercise",
        primaryMuscleGroup: shoulders,
      },
      {
        name: "Hip Thrust",
        description: "Glute Isolation Exercise",
        primaryMuscleGroup: legs,
      },
    ]);
  }
}
