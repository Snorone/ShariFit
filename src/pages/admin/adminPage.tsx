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
import ExercisesPage from "../exercises/Exercises";
import Meals from "../../components/meals/meals";

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

  // useEffect(() => {
  //   if (!isAdmin) return;

  //   const q = query(
  //     collection(db, EXERCISES_COLLECTION),
  //     orderBy(CREATED_AT_FIELD, DESCENDIN_BY_FIELD)
  //   );

  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     setExercises(
  //       snapshot.docs.map(
  //         (docSnap) =>
  //           ({
  //             id: docSnap.id,
  //             ...docSnap.data(),
  //           } as Exercise)
  //       )
  //     );
  //   });

  //   return () => unsubscribe();
  // }, [isAdmin]);

  return (
    <div className="admin-page">
      <h1 className="page-title">Adminpanel</h1>

      {/* Lista */}

      <div className="exercise-list">
        <ExercisesPage />
      </div>
      <div className="exercise-list">
        <Meals />
      </div>
    </div>
  );
}
