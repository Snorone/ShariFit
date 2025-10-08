import { EXERCISES_COLLECTION } from "../utils/db-collection";
import { auth, db } from "./config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 Skapa ny övning
interface ExerciseInput {
  name: string;
  description: string;
  muscleGroup: string;
  type: string;
  createdBy: string;
  createdAt: string;
}

export async function createExercise({
  name,
  description,
  muscleGroup,
  type,
}: ExerciseInput) {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated.");
  }

  const uid = auth.currentUser.uid;

  // 🔸 Inget approved-fält längre
  return await addDoc(collection(db, EXERCISES_COLLECTION), {
    name,
    description,
    muscleGroup,
    type,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
}

// ❌ Ta bort hela approveExercise-funktionen
// (Den behövs inte längre)

// 🔹 Skapa workout
interface WorkoutInput {
  name: string;
  description: string;
  exerciseIds: string[];
  isPublic: boolean;
}

export async function createWorkout({
  name,
  description,
  exerciseIds,
  isPublic,
}: WorkoutInput) {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated.");
  }

  const uid = auth.currentUser.uid;
  return await addDoc(collection(db, "workouts"), {
    name,
    description,
    exerciseIds,
    createdBy: uid,
    public: isPublic,
    createdAt: serverTimestamp(),
  });
}

// 🔹 Logga träning
interface LogInput {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  date: string;
}

export async function addLog(
  uid: string,
  { exerciseId, sets, reps, weight, duration, date }: LogInput
) {
  return await addDoc(collection(db, "users", uid, "logs"), {
    exerciseId,
    sets,
    reps,
    weight,
    duration,
    date,
    createdAt: serverTimestamp(),
  });
}

// 🔹 Skapa måltid
interface MealsInput {
  name: string;
  description: string;
  calories: number;
  createdBy: string;
  createdAt: string;
}

export async function createMeal({ name, description, calories }: MealsInput) {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated.");
  }

  const uid = auth.currentUser.uid;
  return await addDoc(collection(db, "meals"), {
    name,
    description,
    calories,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
}
