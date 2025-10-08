import React, { useEffect, useState, FormEvent } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createExercise } from "../../firebase/dbFunctions";
import { Exercise } from "../../types";
import "./admin.css";
import { Role, useAuth } from "../../context/AuthContext";
import {
  CREATED_AT_FIELD,
  DESCENDIN_BY_FIELD,
  EXERCISES_COLLECTION,
} from "../../utils/db-collection";
import ExercisesPage from "../exercises/ExercisesPage";
import CreateMeals from "../../components/meals/createMeals";
import ShowMeals from "../../components/meals/showMeals";
import CreateExercise from "../../pages/exercises/createExercise";
import ShowExercise from "../../pages/exercises/showExercise";

interface NewExercise {
  name: string;
  description: string;
  muscleGroup: string;
  type: "strength" | "cardio";
}

export default function AdminPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState<NewExercise>({
    name: "",
    description: "",
    muscleGroup: "",
    type: "strength",
  });

  const { user } = useAuth();

  if (user === null) {
    return <div>No user signed in.</div>;
  }
  const isAdmin = user.role === Role.ADMIN;
  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div className="admin-page">
      <h1 className="page-title">Adminpanel</h1>

      <div className="exercise-list">
        <CreateExercise />
        <ShowExercise />
      </div>
      <div className="exercise-list">
        <CreateMeals />
        <ShowMeals />
      </div>
    </div>
  );
}
